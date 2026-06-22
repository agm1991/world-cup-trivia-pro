import { SquadTab } from '@/pages/SquadTab';
import { useSquadPredictorHub } from '@/contexts/SquadPredictorHubContext';
import { formatWorldXiDeadline } from '@/lib/squadPredictorWorldXiRules';

export default function SquadPredictorSquadPage() {
  const {
    worldXi,
    setWorldXi,
    selectedCountry,
    setSelectedCountry,
    browseNation,
    setBrowseNation,
    squad,
    setSquad,
    listPlayers,
    assignStarting,
    assignSub,
    clearStarting,
    clearSub,
    clearPitch,
    getStartingFace,
    getSubFace,
    usedNames,
    saveCurrentSquad,
    openSaveProfileDialog,
    openPublishDialog,
    loadSavedForCountry,
    savedSquads,
    worldXiCommittedSaves,
    worldXiSavesRemaining,
    worldXiEditLocked,
  } = useSquadPredictorHub();

  return (
    <SquadTab
      worldXi={worldXi}
      setWorldXi={setWorldXi}
      selectedCountry={selectedCountry}
      setSelectedCountry={setSelectedCountry}
      browseNation={browseNation}
      setBrowseNation={setBrowseNation}
      squad={squad}
      setSquad={setSquad}
      listPlayers={listPlayers}
      assignStarting={assignStarting}
      assignSub={assignSub}
      clearStarting={clearStarting}
      clearSub={clearSub}
      clearPitch={clearPitch}
      getStartingFace={getStartingFace}
      getSubFace={getSubFace}
      usedNames={usedNames}
      saveCurrentSquad={saveCurrentSquad}
      openSaveProfileDialog={openSaveProfileDialog}
      openPublishDialog={openPublishDialog}
      loadSavedForCountry={loadSavedForCountry}
      savedSquads={savedSquads}
      worldXiCommittedSaves={worldXiCommittedSaves}
      worldXiSavesRemaining={worldXiSavesRemaining}
      worldXiEditLocked={worldXiEditLocked}
      worldXiDeadlineLabel={formatWorldXiDeadline()}
    />
  );
}
