import { useCallback } from "react";
import { useMutation, useQuery } from "react-query";

// Mapping for gamesense json file for service discovery
type ServerData = {
  address: string;
};

// Game constants
const GameIdentifier = "HA_INTEGRATION";
const HealthEventIdentifier = "HEALTH";
const BinderEventIdentifier = "BINDER";

// Device settings
const MsiCq = "msi-mpg341cq";
const RgbZonedDevice = "rgb-zoned-device";
const DeviceType = MsiCq;

const ContextFrameZoneOneKey = "zone-one-context";
const ContextFrameZoneTwoKey = "zone-two-context";
const ContextFrameZoneThreeKey = "zone-three-context";
const ContextFrameZoneFourKey = "zone-four-context";
const ContextFrameZoneFiveKey = "zone-five-context";

type EventData = {
  event: string;
  value: number;
};
type ContextEventData = {
  event: string;
  value: number;
  frame: object;
};

export enum Status {
  LoadingServerData,
  ServerNotRunning,
  SettingUpGame,
  Ready,
}
type ReturnType = {
  status: Status;
  onHealthUpdateAsync: (value: number) => Promise<void>;
  onBinderUpdateAsync: (value: number) => Promise<void>;
  onResetGameSetupAsync: () => Promise<void>;
};
const useGameSense = (): ReturnType => {
  const { data: serverData, isLoading } = useQuery<ServerData>(
    "serverData",
    async () => await window.gamesense.getServerData(),
    {}
  );

  const { status: setupStatus, refetch: setupGame } = useQuery(
    ["setupGame", serverData?.address],
    async () => {
      if (!serverData?.address) return;
      await fetch(`http://${serverData.address}/game_metadata`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game: GameIdentifier,
          game_display_name: "Home Assistant Integration",
          developer: "Crippa9",
        }),
      });
      // register HEALTH event
      // await fetch(`http://${serverData.address}/register_game_event`, {
      //   method: "POST",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     game: GameIdentifier,
      //     event: HealthEventIdentifier,
      //     min_value: 0,
      //     max_value: 100,
      //     icon_id: 16,
      //     value_optional: false,
      //   }),
      // });

      // bind BINDER event
      await fetch(`http://${serverData.address}/bind_game_event`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game: GameIdentifier,
          event: BinderEventIdentifier,
          min_value: 0,
          max_value: 100,
          icon_id: 0,
          value_optional: true,
          handlers: [
            {
              mode: "context-color",
              "device-type": DeviceType,
              "custom-zone-keys": [0, 1, 2, 3, 4, 5, 6, 7],
              "context-frame-key": ContextFrameZoneOneKey,
            },
            {
              mode: "context-color",
              "device-type": DeviceType,
              "custom-zone-keys": [8, 9, 10, 11, 12, 13, 14, 15],
              "context-frame-key": ContextFrameZoneTwoKey,
            },
            {
              mode: "context-color",
              "device-type": DeviceType,
              "custom-zone-keys": [16, 17, 18, 19, 20, 21, 22, 23],
              "context-frame-key": ContextFrameZoneThreeKey,
            },
            {
              mode: "context-color",
              "device-type": DeviceType,
              "custom-zone-keys": [24, 25, 26, 27, 28, 29, 30, 31],
              "context-frame-key": ContextFrameZoneFourKey,
            },
            {
              mode: "context-color",
              "device-type": DeviceType,
              "custom-zone-keys": [32, 33, 34, 35, 36, 37, 38, 39],
              "context-frame-key": ContextFrameZoneFiveKey,
            },
          ],
        }),
      });
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const { mutateAsync: postGameEventAsync } = useMutation(
    ["postGameEvent", serverData?.address],
    async (eventData: EventData) => {
      if (!serverData?.address) return;
      await fetch(`http://${serverData.address}/game_event`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game: GameIdentifier,
          event: eventData.event,
          data: {
            value: eventData.value,
          },
        }),
      });
    }
  );

  const { mutateAsync: postContextGameEventAsync } = useMutation(
    ["postGameEvent", serverData?.address],
    async (eventData: ContextEventData) => {
      if (!serverData?.address) return;
      await fetch(`http://${serverData.address}/game_event`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game: GameIdentifier,
          event: eventData.event,
          data: {
            value: eventData.value,
            frame: eventData.frame,
          },
        }),
      });
    }
  );

  const {} = useQuery(
    ["heartbeat", serverData?.address],
    async () => {
      if (!serverData?.address) return;
      await fetch(`http://${serverData.address}/game_heartbeat`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game: GameIdentifier,
        }),
      });
    },
    {
      refetchInterval: 10_000,
      refetchIntervalInBackground: false,
    }
  );

  const { mutateAsync: removeGameEventAsync } = useMutation(
    ["removeGameEvent", serverData?.address],
    async (eventName: string) => {
      if (!serverData?.address) return;
      await fetch(`http://${serverData.address}/remove_game_event`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game: GameIdentifier,
          event: eventName,
        }),
      });
    }
  );

  const { mutateAsync: removeGameAsync } = useMutation(
    ["removeGame", serverData?.address],
    async () => {
      if (!serverData?.address) return;
      await fetch(`http://${serverData.address}/remove_game`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game: GameIdentifier,
        }),
      });
    }
  );

  const onResetGameSetupAsync = useCallback(async () => {
    // await removeGameEventAsync(HealthEventIdentifier);
    await removeGameEventAsync(BinderEventIdentifier);
    await removeGameAsync();
    await setupGame();
  }, []);

  const onHealthUpdateAsync = useCallback(async (value: number) => {
    await postGameEventAsync({ event: HealthEventIdentifier, value });
  }, []);

  const onBinderUpdateAsync = useCallback(async (value: number) => {
    await postContextGameEventAsync({
      event: BinderEventIdentifier,
      value: value,
      frame: {
        [ContextFrameZoneOneKey]: {
          red: 255,
          green: 105,
          blue: 180,
        },
        [ContextFrameZoneTwoKey]: {
          red: 0,
          green: 255,
          blue: 180,
        },
        [ContextFrameZoneThreeKey]: {
          // todo: add color picker for these
          red: 150,
          green: 255,
          blue: 0,
        },
        [ContextFrameZoneFourKey]: {
          red: 0,
          green: 255,
          blue: 180,
        },
        [ContextFrameZoneFiveKey]: {
          red: 255,
          green: 105,
          blue: 180,
        },
      },
    });
  }, []);

  return {
    status: isLoading
      ? Status.LoadingServerData
      : setupStatus !== "success"
      ? Status.SettingUpGame
      : Status.Ready,
    onHealthUpdateAsync,
    onBinderUpdateAsync,
    onResetGameSetupAsync,
  };
};
export default useGameSense;
