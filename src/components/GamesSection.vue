<template>
  <section class="section container games-section">
    <p class="eyebrow">ONE GAME FIRST. A BIGGER VISION.</p>
    <h2>Built for competitive minds.</h2>
    <p>
      Our first release is planned for VALORANT. Other games are future possibilities, with no
      announced release dates.
    </p>
    <div class="games-grid">
      <div class="game-tile first-game">
        <span class="game-initial" aria-hidden="true">V</span><strong>VALORANT</strong
        ><span class="badge">FIRST RELEASE</span>
      </div>
      <div
        v-for="game in [
          ['L', 'League of Legends'],
          ['CS', 'CS2'],
          ['F', 'Fortnite'],
          ['D', 'Dota 2'],
        ]"
        :key="game[1]"
        class="game-tile"
      >
        <span class="game-initial" aria-hidden="true">{{ game[0] }}</span
        ><strong>{{ game[1] }}</strong
        ><span class="small-label">FUTURE EXPLORATION</span>
      </div>
    </div>
    <p class="more-games">More coming later. Thoughtful progress, one game at a time.</p>
  </section>
</template>
