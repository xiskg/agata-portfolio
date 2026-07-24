"use client";

import type { Scene } from "./types";

type SceneProgressNavProps = {
  scenes: Scene[];
  activeSceneId?: string;
};

export function SceneProgressNav({ scenes, activeSceneId }: SceneProgressNavProps) {
  function scrollToScene(sceneId: string) {
    document.getElementById(`scene-${sceneId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <nav className="hidden flex-col gap-3 text-sm md:flex" aria-label="Résumé sections">
      {scenes.map((scene) => (
        <button
          key={scene.id}
          type="button"
          onClick={() => scrollToScene(scene.id)}
          className={
            scene.id === activeSceneId
              ? "text-left font-medium text-[#6ad3ff]"
              : "text-left text-[#6b6b73] transition-colors hover:text-[#a0a0a8]"
          }
        >
          {scene.label}
        </button>
      ))}
    </nav>
  );
}
