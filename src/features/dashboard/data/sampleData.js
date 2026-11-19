import { users, organisations, cohorts } from './samplePeople.js';
import { tests, attempts } from './sampleAssessments.js';

export function createSampleData() {
  return structuredClone({
    users,
    organisations,
    cohorts,
    tests,
    attempts,
    highlights: [],
    invitations: [
      {
        id: 'invite-1',
        cohortId: '1',
        cohortKind: 'class',
        email: 'riya@example.com',
        status: 'Pending',
      },
    ],
    revisions: [
      {
        id: 'revision-1',
        userId: '1',
        title: 'Make sense of circular motion',
        description: 'Revisit centripetal force, then try three practice questions.',
        date: '2026-11-13',
        completed: false,
        origin: 'Motion & Newton’s laws · Q2',
      },
      {
        id: 'revision-2',
        userId: '1',
        title: 'A closer look at chemical bonds',
        description: 'Draw the shapes of NH₃ and H₂O using VSEPR.',
        date: '2026-11-15',
        completed: false,
        origin: 'Chemistry report',
      },
      {
        id: 'revision-3',
        userId: '1',
        title: 'Refresh the basics of force',
        description: 'Review free-body diagrams and Newton’s second law.',
        date: '2026-11-10',
        completed: true,
      },
    ],
    conversations: [
      {
        id: 'chat-1',
        userId: '1',
        title: 'Understanding Newton’s laws',
        messages: [
          { id: 'm-1', role: 'user', content: 'How do I start drawing a free-body diagram?' },
          {
            id: 'm-2',
            role: 'assistant',
            content:
              'Start by isolating one object. Draw an arrow for every external force acting on it: gravity, the normal force, friction, and any applied force. Then choose your axes and resolve the forces along them.\n\nTry a book resting on a table: weight points down, and the normal force points up. Their equal magnitudes give zero net force. This is a sample explanation for the dashboard preview.',
          },
        ],
      },
      {
        id: 'chat-2',
        userId: '1',
        title: 'Why do atoms form bonds?',
        messages: [
          { id: 'm-3', role: 'user', content: 'Why do atoms form chemical bonds?' },
          {
            id: 'm-4',
            role: 'assistant',
            content:
              'Atoms can form bonds when the resulting arrangement has lower energy. In an ionic bond, electrons transfer and the resulting ions attract. In a covalent bond, atoms share electrons.\n\nThis is a sample response. A connected learning library will supply source-backed explanations later.',
          },
        ],
      },
    ],
  });
}
