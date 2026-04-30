import { useDemoUser } from "@/context/DemoUserContext";

export function useRequireDemoUser() {
  const { user, isVisitor, promptDemoUser } = useDemoUser();
  function requireUser(reason?: string): boolean {
    if (user) return true;
    promptDemoUser(reason);
    return false;
  }
  return { user, isVisitor, requireUser };
}
