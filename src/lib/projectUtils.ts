import type { Project } from "../types";

export interface HealthBreakdown {
  type: string;
  label: string;
  count: number;
  points: number;
}

export interface ProjectHealthResult {
  score: number;
  base: number;
  deductions: HealthBreakdown[];
  summaryText: string;
}

export function calculateProjectHealth(project: any): ProjectHealthResult {
  const base = 100;
  let score = base;
  const deductions: HealthBreakdown[] = [];
  const today = new Date().toISOString().split('T')[0];

  const allDeadlines = [
    ...(project.deadlines || []),
    ...(project.requirements || []).map((r: any) => ({ dueDate: r.deadline, status: r.status })),
    ...(project.asanaTasks || []).map((t: any) => ({ dueDate: t.dueDate, status: t.status })),
    ...(project.questions || []).map((q: any) => ({ dueDate: q.dueDate, status: q.status }))
  ];

  const overdueCount = allDeadlines.filter((d: any) => 
    d.dueDate && d.dueDate < today && !["Done", "Closed", "Answered", "Resolved", "Completed", "Potvrdené", "Zrušené"].includes(d.status)
  ).length;

  if (overdueCount > 0) {
    const points = Math.min(overdueCount * 5, 25);
    score -= points;
    deductions.push({ type: "overdue", label: "Overdue položky", count: overdueCount, points: -points });
  }

  const criticalRisks = (project.risks || []).filter((r: any) => 
    r.severity === 'Kritická' && !['Resolved', 'Closed', 'Accepted'].includes(r.status)
  ).length;
  if (criticalRisks > 0) {
    const points = Math.min(criticalRisks * 10, 30);
    score -= points;
    deductions.push({ type: "critical_risk", label: "Kritické otvorené riziká", count: criticalRisks, points: -points });
  }

  const highRisks = (project.risks || []).filter((r: any) => 
    r.severity === 'Vysoká' && !['Resolved', 'Closed', 'Accepted'].includes(r.status)
  ).length;
  if (highRisks > 0) {
    const points = Math.min(highRisks * 6, 24);
    score -= points;
    deductions.push({ type: "high_risk", label: "Vysoké otvorené riziká", count: highRisks, points: -points });
  }

  const overdueQuestions = (project.questions || []).filter((q: any) => 
    q.dueDate && q.dueDate < today && !['Answered', 'Cancelled'].includes(q.status)
  ).length;
  if (overdueQuestions > 0) {
    const points = Math.min(overdueQuestions * 4, 20);
    score -= points;
    deductions.push({ type: "overdue_question", label: "Otvorené otázky po deadline", count: overdueQuestions, points: -points });
  }

  const missingOwnerCount = [
    ...(project.requirements || []).filter((r: any) => !r.owner && !['Done', 'Obsolete'].includes(r.status)),
    ...(project.questions || []).filter((q: any) => !q.owner && !['Answered', 'Cancelled'].includes(q.status)),
    ...(project.risks || []).filter((r: any) => !r.owner && !['Resolved', 'Closed'].includes(r.status)),
    ...(project.asanaTasks || []).filter((t: any) => !t.assignee && !['Completed'].includes(t.status))
  ].length;
  if (missingOwnerCount > 0) {
    const points = Math.min(missingOwnerCount * 3, 15);
    score -= points;
    deductions.push({ type: "missing_owner", label: "Položky bez ownera", count: missingOwnerCount, points: -points });
  }

  const missingDeadlineCount = [
    ...(project.questions || []).filter((q: any) => !q.dueDate && !['Answered', 'Cancelled'].includes(q.status)),
    ...(project.asanaTasks || []).filter((t: any) => !t.dueDate && !['Completed'].includes(t.status))
  ].length;
  if (missingDeadlineCount > 0) {
    const points = Math.min(missingDeadlineCount * 2, 10);
    score -= points;
    deductions.push({ type: "missing_deadline", label: "Položky bez deadline", count: missingDeadlineCount, points: -points });
  }

  const missingAC = (project.requirements || []).filter((r: any) => 
    r.status === 'Confirmed' && (!r.acceptanceCriteria || r.acceptanceCriteria.length === 0)
  ).length;
  if (missingAC > 0) {
    const points = Math.min(missingAC * 3, 15);
    score -= points;
    deductions.push({ type: "missing_ac", label: "Chýbajúce acceptance criteria", count: missingAC, points: -points });
  }

  const sqlWarnings = (project.sqlQueries || []).filter((q: any) => 
    q.status === 'Failed' || q.status === 'Error'
  ).length;
  if (sqlWarnings > 0) {
    const points = Math.min(sqlWarnings * 2, 10);
    score -= points;
    deductions.push({ type: "sql_warning", label: "SQL Data Quality Warnings", count: sqlWarnings, points: -points });
  }

  score = Math.min(100, Math.max(0, Math.round(score)));

  let summaryText = "";
  if (deductions.length === 0) {
    summaryText = "Health score je stabilný. Nie sú evidované overdue položky ani kritické riziká.";
  } else {
    const issues = deductions.map(d => `${d.count}x ${d.label.toLowerCase()}`).join(", ");
    summaryText = `Health score je znížený o tieto odpočty: ${issues}.`;
  }

  return {
    score,
    base,
    deductions,
    summaryText
  };
}

export function calculateProjectProgress(project: Project) {
  // Weights
  const weights = {
    requirements: 0.25,
    jira: 0.20,
    asana: 0.15,
    decisions: 0.10,
    questions: 0.10,
    risks: 0.10,
    milestones: 0.10
  };

  // Completion calculation helpers
  const getCompletion = (items: any[], doneStatuses: string[]) => {
    if (!items || items.length === 0) return 100; // If no items, consider area "done" or not started? Let's say 0 for better logic? No, 100 to not penalize empty lists if they are not needed. Actually, for a project, let's say 0 if it's empty but required. For this prototype, we'll assume empty means not yet started = 0.
    const done = items.filter(item => doneStatuses.includes(item.status)).length;
    return (done / items.length) * 100;
  };

  const reqProgress = getCompletion(project.requirements, ["Done", "Obsolete"]);
  const jiraProgress = getCompletion(project.jiraItems, ["Done", "Closed"]);
  const asanaProgress = project.asanaTasks && project.asanaTasks.length > 0 
    ? (project.asanaTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / project.asanaTasks.length)
    : 0;
  const decProgress = getCompletion(project.decisions, ["Potvrdené", "Zmenené", "Zastarané", "Zrušené"]);
  const qstProgress = getCompletion(project.questions, ["Answered", "Cancelled"]);
  const riskProgress = getCompletion(project.risks, ["Resolved", "Accepted", "Closed"]);
  const milestoneProgress = project.milestones && project.milestones.length > 0
    ? (project.milestones.reduce((acc, m) => acc + (m.progress || 0), 0) / project.milestones.length)
    : 0;

  const totalProgress = (
    (reqProgress * weights.requirements) +
    (jiraProgress * weights.jira) +
    (asanaProgress * weights.asana) +
    (decProgress * weights.decisions) +
    (qstProgress * weights.questions) +
    (riskProgress * weights.risks) +
    (milestoneProgress * weights.milestones)
  );

  // Health Score calculation
  // Start with 100, reduce for overdue items, high risks, and blocked items.
  let healthScore = 100;

  // Overdue deadines reduction
  const today = new Date().toISOString().split('T')[0];
  const allDeadlines = [
    ...(project.deadlines || []),
    ...project.requirements.map(r => ({ dueDate: r.deadline, status: r.status })),
    ...project.asanaTasks.map(t => ({ dueDate: t.dueDate, status: t.status })),
    ...project.questions.map(q => ({ dueDate: q.dueDate, status: q.status }))
  ];

  const overdueCount = allDeadlines.filter((d: any) => 
    d.dueDate && d.dueDate < today && !["Done", "Closed", "Answered", "Resolved", "Completed"].includes(d.status)
  ).length;

  healthScore -= (overdueCount * 5); // 5 points per overdue item

  // Critical Risks reduction
  const criticalRisks = project.risks.filter(r => r.severity === 'Kritická' || r.severity === 'Vysoká').length;
  healthScore -= (criticalRisks * 3);

  // Blocked items reduction
  const blockedCount = [
    ...project.asanaTasks.filter(t => t.status === 'Blocked'),
    ...project.questions.filter(q => q.status === 'Blocked')
  ].length;
  healthScore -= (blockedCount * 4);

  return {
    progress: Math.min(100, Math.max(0, Math.round(totalProgress))),
    health: Math.min(100, Math.max(0, Math.round(healthScore))),
    overdueCount,
    blockedCount,
    reqProgress,
    jiraProgress,
    asanaProgress,
    milestoneProgress
  };
}
