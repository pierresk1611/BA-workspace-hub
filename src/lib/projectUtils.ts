import type { Project } from "../types";

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
