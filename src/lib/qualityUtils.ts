import type { Project } from '../types';

export interface QualityIssue {
  id: string;
  category: 'Critical' | 'Warning' | 'Info' | 'Security';
  entityType: string;
  entityName: string;
  description: string;
  recommendation: string;
}

export interface QualityReport {
  score: number;
  issues: QualityIssue[];
}

export function performQualityCheck(project: Project): QualityReport {
  const issues: QualityIssue[] = [];
  let totalChecks = 0;
  let passedChecks = 0;

  const addIssue = (category: QualityIssue['category'], entityType: string, entityName: string, description: string, recommendation: string) => {
    issues.push({
      id: Math.random().toString(36).substring(7),
      category,
      entityType,
      entityName,
      description,
      recommendation
    });
  };

  const check = (condition: boolean, category: QualityIssue['category'], entityType: string, entityName: string, description: string, recommendation: string) => {
    totalChecks++;
    if (!condition) {
      addIssue(category, entityType, entityName, description, recommendation);
    } else {
      passedChecks++;
    }
  };

  // 1. Requirements
  project.requirements.forEach(req => {
    check(!!req.owner, 'Critical', 'Requirement', req.id, 'Chýba owner požiadavky.', 'Priraďte zodpovedného analytika alebo biznis ownera.');
    check(!!req.deadline, 'Warning', 'Requirement', req.id, 'Chýba deadline požiadavky.', 'Nastavte cieľový dátum pre analýzu alebo vývoj.');
    check(!!req.acceptanceCriteria && req.acceptanceCriteria.length > 10, 'Critical', 'Requirement', req.id, 'Chýbajú akceptačné kritériá.', 'Definujte Given/When/Then scenáre.');
    check(!!req.relatedJiraKey, 'Warning', 'Requirement', req.id, 'Požiadavka nie je prepojená s Jirou.', 'Vytvorte Jira task a prepojte ho s požiadavkou.');
  });

  // 2. Jira Items
  (project.jiraItems || []).forEach(jira => {
    check(!!jira.linkedRequirement, 'Warning', 'Jira Item', jira.key, 'Jira položka nie je prepojená na požiadavku.', 'Priraďte k Jira tasku ID požiadavky.');
  });

  // 3. Questions
  project.questions.forEach(q => {
    if (q.status === 'Open' || q.status === 'Waiting for answer') {
      const isOverdue = q.dueDate && new Date(q.dueDate) < new Date();
      check(!isOverdue, 'Critical', 'Question', q.id, 'Otázka po deadline.', 'Urgujte odpoveď od ownera alebo eskalujte bloker.');
    }
  });

  // 4. Decisions
  project.decisions.forEach(d => {
    check(!!d.sourceType && d.sourceType !== 'Iné', 'Warning', 'Decision', d.id, 'Rozhodnutie nemá jasný zdroj.', 'Doplňte odkaz na meeting alebo komunikáciu.');
  });

  // 5. Risks
  project.risks.forEach(r => {
    check(!!r.mitigationPlan, 'Critical', 'Risk', r.id, 'Riziko nemá plán mitigácie.', 'Definujte konkrétne kroky na zníženie dopadu alebo pravdepodobnosti.');
    check(!!r.mitigationDeadline, 'Warning', 'Risk', r.id, 'Riziko nemá termín mitigácie.', 'Nastavte deadline pre mitigačné kroky.');
  });

  // 6. Asana Tasks
  project.asanaTasks.forEach(t => {
    check(!!t.owner, 'Critical', 'Task', t.title, 'Task nemá ownera.', 'Priraďte zodpovednú osobu.');
    const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done';
    check(!isOverdue, 'Warning', 'Task', t.title, 'Task je po deadline.', 'Aktualizujte progres alebo posuňte termín.');
  });

  // 7. Meetings
  project.meetings.forEach(m => {
    check(!!m.transcript && m.transcript.length > 50, 'Info', 'Meeting', m.title, 'Meeting nemá poriadny zápis.', 'Doplňte kľúčové body z meetingu.');
  });

  // 8. SQL Workspace
  (project.sqlQueries || []).forEach(sq => {
    check(!!sq.owner, 'Warning', 'SQL Query', sq.name, 'SQL dotaz nemá ownera.', 'Priraďte autora alebo zodpovedného dátového analytika.');
    check(!!sq.description, 'Warning', 'SQL Query', sq.name, 'Chýba popis účelu dotazu.', 'Doplňte informáciu, čo tento dotaz počíta.');
    
    // Security checks
    const hasCreds = /password|secret|token|key|credential/i.test(sq.sqlText);
    check(!hasCreds, 'Security', 'SQL Query', sq.name, 'Podozrivý text v SQL (možné credentials).', 'Odstráňte heslá alebo tokeny z textu dotazu!');
    
    const hasProdLink = /jdbc:postgresql:\/\/prod|jdbc:mysql:\/\/prod|10\.255\.|10\.0\./i.test(sq.sqlText);
    check(!hasProdLink, 'Security', 'SQL Query', sq.name, 'SQL obsahuje produkčný connection string.', 'Nahraďte reálne prepojenia mock dokumentáciou.');
  });

  (project.sqlResults || []).forEach(sr => {
    check(!!sr.baInterpretation, 'Critical', 'SQL Result', sr.name, 'Výsledok nemá BA interpretáciu.', 'Doplňte biznis záver z týchto dát.');
  });

  const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;

  return {
    score,
    issues: issues.sort((a, b) => {
      const priority = { 'Security': 0, 'Critical': 1, 'Warning': 2, 'Info': 3 };
      return priority[a.category] - priority[b.category];
    })
  };
}
