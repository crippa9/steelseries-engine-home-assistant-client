import React, { useEffect, useState } from "react";
import useGameSense, { Status } from "./api/use-gamesense";

const App: React.FC = () => {
  const [health, setHealth] = useState<number>(0);
  const [binderValue, setBinderValue] = useState<number>(0);

  const {
    onHealthUpdateAsync,
    onBinderUpdateAsync,
    onResetGameSetupAsync,
    status,
  } = useGameSense();

  useEffect(() => {
    onBinderUpdateAsync(binderValue);
  }, [binderValue, onBinderUpdateAsync]);

  return (
    <>
      {status === Status.LoadingServerData ? (
        <p>Checking if Game Engine is running</p>
      ) : status === Status.SettingUpGame ? (
        <p>Setting up game</p>
      ) : status === Status.Ready ? (
        <>
          <p>Server running.</p>
          <div>
            <button onClick={() => onResetGameSetupAsync()}>
              Reset game setup
            </button>
          </div>
          <div>
            <input
              type="number"
              max={100}
              min={0}
              value={health}
              onChange={({ target }) =>
                setHealth(Number.parseFloat(target.value))
              }
            />
            <button onClick={() => onHealthUpdateAsync(health)}>
              Send health event
            </button>
          </div>
          <div>
            <input
              type="number"
              max={100}
              min={0}
              value={binderValue}
              onChange={({ target }) =>
                setBinderValue(Number.parseFloat(target.value))
              }
            />
          </div>
        </>
      ) : (
        <>Steelseries Game Engine not running</>
      )}
    </>
  );
};

export default App;
