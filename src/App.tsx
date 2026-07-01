import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LocalProfileProvider } from "@/contexts/LocalProfileContext";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import CategoryLevels from "./pages/CategoryLevels";
import Game from "./pages/Game";
import Profile from "./pages/Profile";
import CreateProfile from "./pages/CreateProfile";
import PlayerLevels from "./pages/PlayerLevels";
import PlayerCountryPlayers from "./pages/PlayerCountryPlayers";
import PlayerLevelSelection from "./pages/PlayerLevelSelection";
import PlayerKickOff from "./pages/PlayerKickOff";
import PlayerGame from "./pages/PlayerGame";
import LevelIntro from "./pages/LevelIntro";
import CountryHistory from "./pages/CountryHistory";
import CountryHistoryYears from "./pages/CountryHistoryYears";

import CountryGame from "./pages/CountryGame";
import WorldCupWinners from "./pages/WorldCupWinners";
import WorldCupWinnersCountry from "./pages/WorldCupWinnersCountry";
import WinnersGame from "./pages/WinnersGame";
import ScorelineByYear from "./pages/ScorelineByYear";
import ScorelineGame from "./pages/ScorelineGame";
import ManagersGame from "./pages/ManagersGame";
import ManagersSelect from "./pages/ManagersSelect";
import ManagersCountryManagers from "./pages/ManagersCountryManagers";
import StadiumsGame from "./pages/StadiumsGame";
import MissingPlayerLevels from "./pages/MissingPlayerLevels";

const MissingPlayerGame = lazy(() => import("./pages/MissingPlayerGame"));
import SquadPuzzleGame from "./pages/SquadPuzzleGame";
import DestinyRouteSelect from "./pages/DestinyRouteSelect";
import DestinyRouteGame from "./pages/DestinyRouteGame";
import SquadPredictorLayout from "./pages/SquadPredictorLayout";
import { SquadPredictorHubIndex } from "./pages/SquadPredictorHubIndex";
import SquadPredictorSquadPage from "./pages/SquadPredictorSquadPage";
import SquadPredictorTournamentPage from "./pages/SquadPredictorTournamentPage";
import SquadPredictorKnockoutRoadPage from "./pages/SquadPredictorKnockoutRoadPage";
import SquadPredictorAwardsPage from "./pages/SquadPredictorAwardsPage";
import SquadPredictorCommunityPage from "./pages/SquadPredictorCommunityPage";
import Leaderboard from "./pages/Leaderboard";
import Menu from "./pages/Menu";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LocalProfileProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/levels/:category" element={<CategoryLevels />} />
            <Route path="/world-cup" element={<Navigate to="/levels/world-cup" replace />} />
            <Route path="/guess-who" element={<Navigate to="/levels/guess-who" replace />} />
            <Route path="/players" element={<Navigate to="/levels/player" replace />} />
            <Route path="/winners" element={<Navigate to="/world-cup-winners" replace />} />
            <Route path="/levels/player" element={<PlayerLevels />} />
            <Route path="/levels/player/:country" element={<PlayerCountryPlayers />} />
            <Route path="/player-levels/:playerId" element={<PlayerLevelSelection />} />
            <Route path="/player-kickoff/:playerId/:level" element={<PlayerKickOff />} />
            <Route path="/player-game/:playerId/:level" element={<PlayerGame />} />
            <Route path="/level/:category/:level" element={<LevelIntro />} />
            <Route path="/game/:category" element={<Game />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/country-history/:countryCode" element={<CountryHistoryYears />} />
            <Route path="/country-history" element={<CountryHistory />} />
            <Route path="/country-game/:countryCode/:year" element={<CountryGame />} />
            <Route path="/world-cup-winners" element={<WorldCupWinners />} />
            <Route path="/world-cup-winners/:country" element={<WorldCupWinnersCountry />} />
            <Route path="/winners-game/:country/:year" element={<WinnersGame />} />
            <Route path="/scoreline-by-year" element={<ScorelineByYear />} />
            <Route path="/scoreline-game/:year" element={<ScorelineGame />} />
            <Route path="/managers-select" element={<ManagersSelect />} />
            <Route path="/managers-select/:country" element={<ManagersCountryManagers />} />
            <Route path="/managers" element={<ManagersGame />} />
            <Route path="/managers-game/:country/:manager" element={<ManagersGame />} />
            <Route path="/stadiums" element={<Navigate to="/levels/stadiums" replace />} />
            <Route path="/level/stadiums/:level" element={<StadiumsGame />} />
            <Route path="/missing-player" element={<MissingPlayerLevels />} />
            <Route
              path="/missing-player/:level"
              element={
                <Suspense
                  fallback={
                    <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
                      Loading level…
                    </div>
                  }
                >
                  <MissingPlayerGame />
                </Suspense>
              }
            />
            <Route path="/squad-puzzle/:playerId" element={<SquadPuzzleGame />} />
            <Route path="/destiny" element={<DestinyRouteSelect />} />
            <Route path="/destiny-route-select" element={<DestinyRouteSelect />} />
            <Route path="/destiny-route-game" element={<DestinyRouteGame />} />
            <Route path="/squad-predictor" element={<SquadPredictorLayout />}>
              <Route index element={<SquadPredictorHubIndex />} />
              <Route path="squad" element={<SquadPredictorSquadPage />} />
              <Route path="tournament/knockouts" element={<SquadPredictorKnockoutRoadPage />} />
              <Route path="tournament" element={<SquadPredictorTournamentPage />} />
              <Route path="awards" element={<SquadPredictorAwardsPage />} />
              <Route path="community" element={<SquadPredictorCommunityPage />} />
              <Route path="*" element={<Navigate to="/squad-predictor/squad" replace />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </LocalProfileProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
