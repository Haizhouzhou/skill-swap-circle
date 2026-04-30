import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DemoUserProvider } from "@/context/DemoUserContext";
import { AppShell } from "@/components/AppShell";

import Landing from "./pages/Landing";
import BrowseLearn from "./pages/BrowseLearn";
import BrowseTeach from "./pages/BrowseTeach";
import ListingPage from "./pages/ListingPage";
import PublicProfile from "./pages/PublicProfile";
import Dashboard from "./pages/Dashboard";
import CreateOffer from "./pages/CreateOffer";
import CreateRequest from "./pages/CreateRequest";
import CreateProfile from "./pages/CreateProfile";
import MedalSettings from "./pages/MedalSettings";
import ChatPage from "./pages/ChatPage";
import Impact from "./pages/Impact";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DemoUserProvider>
          <AppShell>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/browse/learn" element={<BrowseLearn />} />
              <Route path="/browse/teach" element={<BrowseTeach />} />
              <Route path="/listing/:id" element={<ListingPage />} />
              <Route path="/profile/:userId" element={<PublicProfile />} />
              <Route path="/me" element={<Dashboard />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="/me/create-offer" element={<CreateOffer />} />
              <Route path="/me/create-request" element={<CreateRequest />} />
              <Route path="/me/medals" element={<MedalSettings />} />
              <Route path="/chat/:threadId" element={<ChatPage />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppShell>
        </DemoUserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
