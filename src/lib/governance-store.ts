import { useSyncExternalStore } from "react";
import { proposals as seedProposals, initialComments, type Proposal, type Comment } from "./mock-data";

type State = {
  proposals: Proposal[];
  comments: Comment[];
  votes: Record<string, "approve" | "reject" | undefined>;
};

let state: State = {
  proposals: seedProposals.map((p) => ({ ...p })),
  comments: [...initialComments],
  votes: {},
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const store = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get: () => state,
  vote(proposalId: string, choice: "approve" | "reject") {
    const prev = state.votes[proposalId];
    if (prev === choice) return;
    state = {
      ...state,
      votes: { ...state.votes, [proposalId]: choice },
      proposals: state.proposals.map((p) => {
        if (p.id !== proposalId) return p;
        let approve = p.approve;
        let reject = p.reject;
        if (prev === "approve") approve--;
        if (prev === "reject") reject--;
        if (choice === "approve") approve++;
        else reject++;
        return { ...p, approve, reject };
      }),
    };
    emit();
  },
  addComment(c: Omit<Comment, "id" | "createdAt">) {
    state = {
      ...state,
      comments: [
        ...state.comments,
        { ...c, id: `c${Date.now()}`, createdAt: Date.now() },
      ],
    };
    emit();
  },
};

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(state),
    () => selector(state),
  );
}
