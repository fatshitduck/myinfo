const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

// Smooth scroll from Top-Left Donate me button to the bottom Buy me some caffeine section
const donateScrollBtn = document.getElementById("donate-scroll-btn");
if (donateScrollBtn) {
  donateScrollBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });
}

// CS2 Stats 2-Tab Switcher (Matchmaking / FACEIT)
(function initCs2Tabs() {
  const tabs = [
    document.getElementById("cs2-tab-mm"),
    document.getElementById("cs2-tab-faceit"),
  ].filter(Boolean);
  const panels = {
    mm: document.getElementById("cs2-panel-mm"),
    faceit: document.getElementById("cs2-panel-faceit"),
  };
  const modeMetaEl = document.getElementById("cs2-mode-meta");
  const modeMetaLabels = {
    mm: "Erist • 3,640 hrs CS2",
    faceit: "Erist_ • FACEIT CS2",
  };

  if (tabs.length < 2 || !panels.mm || !panels.faceit) return;

  function activateTab(key, moveFocus) {
    tabs.forEach((tab) => {
      const tabKey = tab.dataset.cs2Tab;
      const active = tabKey === key;
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.tabIndex = active ? 0 : -1;
      tab.classList.toggle("is-active", active);
      if (panels[tabKey]) {
        panels[tabKey].hidden = !active;
      }
      if (active && moveFocus) {
        tab.focus();
      }
    });
    if (modeMetaEl && modeMetaLabels[key]) {
      modeMetaEl.textContent = modeMetaLabels[key];
    }
  }

  tabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => {
      activateTab(tab.dataset.cs2Tab, false);
    });

    tab.addEventListener("keydown", (e) => {
      let nextIdx = -1;
      if (e.key === "ArrowRight") nextIdx = (idx + 1) % tabs.length;
      else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") nextIdx = 0;
      else if (e.key === "End") nextIdx = tabs.length - 1;
      if (nextIdx >= 0) {
        e.preventDefault();
        activateTab(tabs[nextIdx].dataset.cs2Tab, true);
      }
    });
  });
})();

// Live CS2 Stats via Public Leetify v3 API (Steam64: 76561198845357399)
(function initCs2Stats() {
  const STEAM_ID = "76561198845357399";
  const PROFILE_URL = `https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${STEAM_ID}`;
  const MATCHES_URL = `https://api-public.cs-prod.leetify.com/v3/profile/matches?steam64_id=${STEAM_ID}`;

  const PEAKS = {
    premier: 23679,
    comp: 16,
    faceitLevel: 10,
    faceitElo: 2456,
  };
  const FACEIT_SNAPSHOT_MS = Date.parse("2026-08-14T00:00:00Z");

  const COMP_RANKS = {
    1: ["S1", "Silver I"],
    2: ["S2", "Silver II"],
    3: ["S3", "Silver III"],
    4: ["S4", "Silver IV"],
    5: ["SE", "Silver Elite"],
    6: ["SEM", "Silver Elite Master"],
    7: ["GN1", "Gold Nova I"],
    8: ["GN2", "Gold Nova II"],
    9: ["GN3", "Gold Nova III"],
    10: ["GNM", "Gold Nova Master"],
    11: ["MG1", "Master Guardian I"],
    12: ["MG2", "Master Guardian II"],
    13: ["MGE", "Master Guardian Elite"],
    14: ["DMG", "Distinguished Master Guardian"],
    15: ["LE", "Legendary Eagle"],
    16: ["LEM", "Legendary Eagle Master"],
    17: ["SMFC", "Supreme Master First Class"],
    18: ["GE", "Global Elite"],
  };

  const MAP_NAMES = {
    de_mirage: "Mirage",
    de_dust2: "Dust 2",
    de_inferno: "Inferno",
    de_nuke: "Nuke",
    de_ancient: "Ancient",
    de_anubis: "Anubis",
    de_overpass: "Overpass",
    de_vertigo: "Vertigo",
    de_train: "Train",
    de_cache: "Cache",
    de_cbble: "Cobblestone",
    cs_office: "Office",
    cs_italy: "Italy",
  };

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && typeof value === "string") {
      el.textContent = value;
    }
  }

  function formatMapName(raw) {
    if (!raw || typeof raw !== "string") return "";
    if (MAP_NAMES[raw]) return MAP_NAMES[raw];
    const bare = raw.replace(/^(de_|cs_)/, "");
    return bare.charAt(0).toUpperCase() + bare.slice(1);
  }

  function formatSigned(val, decimals) {
    const sign = val >= 0 ? "+" : "";
    return `${sign}${val.toFixed(decimals)}`;
  }

  function premierTierClass(rating) {
    if (rating >= 30000) return "tier-premier-gold";
    if (rating >= 25000) return "tier-premier-red";
    if (rating >= 20000) return "tier-premier-pink";
    if (rating >= 15000) return "tier-premier-purple";
    if (rating >= 10000) return "tier-premier-blue";
    if (rating >= 5000) return "tier-premier-lightblue";
    return "tier-premier-grey";
  }

  function compIconSrc(rankId) {
    const clamped = Math.max(1, Math.min(18, Math.round(rankId)));
    return `assets/ranks/comp-${clamped}.png`;
  }

  function faceitIconSrc(level) {
    const clamped = Math.max(1, Math.min(10, Math.round(level)));
    return `assets/ranks/faceit-${clamped}.svg`;
  }

  function renderCompMaps(items) {
    const container = document.getElementById("mm-comp-maps");
    if (!container || !items.length) return;
    container.replaceChildren();
    items.forEach((item) => {
      const info = COMP_RANKS[item.rank];
      if (!info) return;
      const chip = document.createElement("span");
      chip.className = "cs2-chip";
      chip.title = info[1];

      const nameEl = document.createElement("span");
      nameEl.className = "cs2-chip-name";
      nameEl.textContent = formatMapName(item.map_name);

      const iconEl = document.createElement("img");
      iconEl.className = "rank-icon-chip";
      iconEl.src = compIconSrc(item.rank);
      iconEl.alt = "";
      iconEl.width = 40;
      iconEl.height = 16;
      iconEl.setAttribute("aria-hidden", "true");

      const valEl = document.createElement("strong");
      valEl.className = "cs2-chip-val";
      valEl.textContent = info[0];

      chip.append(nameEl, iconEl, valEl);
      container.appendChild(chip);
    });
  }

  function renderFormDots(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container || !items.length) return;
    container.replaceChildren();
    items.forEach((entry) => {
      const dot = document.createElement("span");
      const cls = entry.code === "W" ? "form-w" : entry.code === "L" ? "form-l" : "form-t";
      dot.className = `cs2-form-dot ${cls}`;
      dot.textContent = entry.code;
      dot.title = `${entry.map} ${entry.score} (${entry.code})`;
      container.appendChild(dot);
    });
  }

  function aggregateMatches(matches) {
    let kills = 0;
    let deaths = 0;
    let hsKills = 0;
    let dmg = 0;
    let rounds = 0;
    let w = 0;
    let l = 0;
    let t = 0;
    let m3 = 0;
    let m4 = 0;
    let m5 = 0;
    let csGood = 0;
    let csAll = 0;
    let reactSum = 0;
    let reactN = 0;
    let preaimSum = 0;
    let preaimN = 0;
    let ratingSum = 0;
    let ratingN = 0;
    const form = [];

    matches.forEach((m) => {
      const statsList = Array.isArray(m.stats) ? m.stats : [];
      const s = statsList.find((x) => x && x.steam64_id === STEAM_ID);
      if (!s) return;

      kills += s.total_kills || 0;
      deaths += s.total_deaths || 0;
      hsKills += s.total_hs_kills || 0;
      dmg += s.total_damage || 0;
      rounds += s.rounds_count || 0;
      const rw = s.rounds_won || 0;
      const rl = s.rounds_lost || 0;
      const code = rw > rl ? "W" : rw < rl ? "L" : "T";
      if (code === "W") w += 1;
      else if (code === "L") l += 1;
      else t += 1;

      if (form.length < 8) {
        form.push({
          code,
          map: formatMapName(m.map_name),
          score: `${rw}–${rl}`,
        });
      }

      m3 += s.multi3k || 0;
      m4 += s.multi4k || 0;
      m5 += s.multi5k || 0;
      csGood += s.counter_strafing_shots_good || 0;
      csAll += s.counter_strafing_shots_all || 0;

      if (typeof s.reaction_time === "number" && s.reaction_time > 0) {
        reactSum += s.reaction_time * 1000;
        reactN += 1;
      }
      if (typeof s.preaim === "number" && s.preaim > 0) {
        preaimSum += s.preaim;
        preaimN += 1;
      }
      if (typeof s.leetify_rating === "number") {
        ratingSum += s.leetify_rating * 100;
        ratingN += 1;
      }
    });

    const count = w + l + t;
    return {
      count,
      w,
      l,
      t,
      kills,
      hsKills,
      wr: count > 0 ? (100 * w) / count : 0,
      kd: deaths > 0 ? kills / deaths : 0,
      adr: rounds > 0 ? dmg / rounds : 0,
      hsKillPct: kills > 0 ? (100 * hsKills) / kills : 0,
      csPct: csAll > 0 ? (100 * csGood) / csAll : 0,
      reactMs: reactN > 0 ? reactSum / reactN : 0,
      preaim: preaimN > 0 ? preaimSum / preaimN : 0,
      rating: ratingN > 0 ? ratingSum / ratingN : 0,
      m3,
      m4,
      m5,
      form,
    };
  }

  function applyProfile(data) {
    if (!data || typeof data !== "object") return;
    const ranks = data.ranks || {};
    const rating = data.rating || {};
    const stats = data.stats || {};
    const recent = Array.isArray(data.recent_matches) ? data.recent_matches : [];

    if (typeof ranks.premier === "number") {
      setText("mm-premier", ranks.premier.toLocaleString("en-US"));
      const iconEl = document.getElementById("mm-premier-icon");
      if (iconEl) {
        iconEl.setAttribute("class", `rank-icon-premier ${premierTierClass(ranks.premier)}`);
      }

      const recentPremierMax = recent.reduce((acc, m) => {
        if (m && m.data_source === "matchmaking" && m.rank_type === 11 && typeof m.rank === "number") {
          return Math.max(acc, m.rank);
        }
        return acc;
      }, 0);
      const bestPremier = Math.max(PEAKS.premier, ranks.premier, recentPremierMax);
      setText("mm-premier-peak", bestPremier.toLocaleString("en-US"));
      const peakIconEl = document.getElementById("mm-premier-peak-icon");
      if (peakIconEl) {
        peakIconEl.setAttribute("class", `rank-icon-premier-sm ${premierTierClass(bestPremier)}`);
      }
      if (bestPremier > PEAKS.premier) {
        setText("mm-premier-peak-meta", "• Peak");
      }
    }

    const activeComp = Array.isArray(ranks.competitive)
      ? ranks.competitive
          .filter((item) => item && typeof item.rank === "number" && item.rank > 0 && COMP_RANKS[item.rank])
          .sort((a, b) => b.rank - a.rank)
      : [];
    if (activeComp.length > 0) {
      const top = activeComp[0];
      const topInfo = COMP_RANKS[top.rank];
      const compEl = document.getElementById("mm-comp-rank");
      if (compEl && topInfo) {
        compEl.textContent = topInfo[0];
        compEl.title = topInfo[1];
      }
      const compIconEl = document.getElementById("mm-comp-icon");
      if (compIconEl && topInfo) {
        compIconEl.src = compIconSrc(top.rank);
        compIconEl.alt = topInfo[1];
      }

      const recentCompMax = recent.reduce((acc, m) => {
        if (
          m &&
          m.data_source === "matchmaking" &&
          m.rank_type === 12 &&
          typeof m.rank === "number" &&
          m.rank <= 18
        ) {
          return Math.max(acc, m.rank);
        }
        return acc;
      }, 0);
      const bestComp = Math.max(PEAKS.comp, top.rank, recentCompMax);
      const bestInfo = COMP_RANKS[bestComp];
      const peakEl = document.getElementById("mm-comp-peak");
      if (peakEl && bestInfo) {
        peakEl.textContent = bestInfo[0];
        peakEl.title = bestInfo[1];
      }
      const peakCompIcon = document.getElementById("mm-comp-peak-icon");
      if (peakCompIcon) {
        peakCompIcon.src = compIconSrc(bestComp);
      }
      if (bestComp === top.rank) {
        setText("mm-comp-peak-meta", `• ${formatMapName(top.map_name)}`);
      }
      renderCompMaps(activeComp);
    }

    if (typeof ranks.leetify === "number") {
      setText("mm-leetify", formatSigned(ranks.leetify, 2));
    }
    if (typeof rating.ct_leetify === "number" && typeof rating.t_leetify === "number") {
      const ct = formatSigned(rating.ct_leetify * 100, 2);
      const tSide = formatSigned(rating.t_leetify * 100, 2);
      setText("mm-sides", `CT ${ct} • T ${tSide}`);
    }
    if (typeof data.winrate === "number") {
      const pct = data.winrate <= 1 ? data.winrate * 100 : data.winrate;
      setText("mm-winrate", `${pct.toFixed(1)}%`);
    }
    if (typeof data.total_matches === "number") {
      setText("mm-matches", `${data.total_matches.toLocaleString("en-US")} tracked`);
    }
    if (typeof rating.aim === "number") {
      setText("mm-aim", rating.aim.toFixed(1));
    }
    if (typeof rating.positioning === "number" && typeof rating.utility === "number") {
      setText("mm-sub-ratings", `Pos ${rating.positioning.toFixed(1)} • Util ${rating.utility.toFixed(1)}`);
    }
    if (typeof stats.counter_strafing_good_shots_ratio === "number") {
      setText("mm-cs", `${stats.counter_strafing_good_shots_ratio.toFixed(1)}%`);
    }
    if (typeof stats.reaction_time_ms === "number") {
      setText("mm-ttd", `${Math.round(stats.reaction_time_ms)} ms`);
    }
    if (typeof stats.preaim === "number") {
      setText("mm-preaim", `${stats.preaim.toFixed(1)}° preaim`);
    }
    if (typeof stats.accuracy_enemy_spotted === "number") {
      setText("mm-acc", `${stats.accuracy_enemy_spotted.toFixed(1)}%`);
    }
    if (typeof stats.spray_accuracy === "number") {
      setText("mm-spray", `${stats.spray_accuracy.toFixed(1)}% spray`);
    }
    if (typeof stats.accuracy_head === "number") {
      setText("mm-hs-acc", `${stats.accuracy_head.toFixed(1)}%`);
    }
    if (
      typeof stats.ct_opening_duel_success_percentage === "number" &&
      typeof stats.t_opening_duel_success_percentage === "number"
    ) {
      setText("mm-open-ct", `${stats.ct_opening_duel_success_percentage.toFixed(1)}%`);
      setText("mm-open-t", `CT • ${stats.t_opening_duel_success_percentage.toFixed(1)}% T`);
    }

    // Only update current FACEIT rank if Leetify has matches newer than the verified Aug 2026 snapshot
    const newestFaceitMs = recent.reduce((maxMs, m) => {
      if (m && m.data_source === "faceit" && m.finished_at) {
        const ts = Date.parse(m.finished_at);
        if (!Number.isNaN(ts)) return Math.max(maxMs, ts);
      }
      return maxMs;
    }, 0);

    if (newestFaceitMs > FACEIT_SNAPSHOT_MS) {
      if (typeof ranks.faceit === "number") {
        setText("fc-level", `Level ${ranks.faceit}`);
        const fcIcon = document.getElementById("fc-lvl-icon");
        if (fcIcon) {
          fcIcon.src = faceitIconSrc(ranks.faceit);
          fcIcon.alt = `FACEIT Level ${ranks.faceit}`;
        }
      }
      if (typeof ranks.faceit_elo === "number") {
        setText("fc-elo", `${ranks.faceit_elo.toLocaleString("en-US")} ELO`);
      }
    }

    if (typeof ranks.faceit === "number" && ranks.faceit > PEAKS.faceitLevel) {
      setText("fc-peak-lvl", `Level ${ranks.faceit}`);
      const fcPeakIcon = document.getElementById("fc-peak-icon");
      if (fcPeakIcon) {
        fcPeakIcon.src = faceitIconSrc(ranks.faceit);
        fcPeakIcon.alt = `FACEIT Level ${ranks.faceit}`;
      }
    }
    if (typeof ranks.faceit_elo === "number" && ranks.faceit_elo > PEAKS.faceitElo) {
      setText("fc-peak-elo", `${ranks.faceit_elo.toLocaleString("en-US")} ELO`);
      setText("fc-peak-meta", "• Peak");
    }
  }

  function applyMatches(matches) {
    if (!Array.isArray(matches) || matches.length === 0) return;

    const premList = matches.filter((m) => m && m.data_source === "matchmaking");
    const compList = matches.filter((m) => m && m.data_source === "matchmaking_competitive");
    const faceitList = matches.filter((m) => m && m.data_source === "faceit");

    if (premList.length > 0) {
      const p = aggregateMatches(premList);
      const tiePart = p.t > 0 ? `–${p.t}T` : "";
      setText("mm-prem-record", `${p.w}W–${p.l}L${tiePart} • ${p.wr.toFixed(1)}% WR`);
      setText("mm-prem-kd", p.kd.toFixed(2));
      setText("mm-prem-adr", p.adr.toFixed(1));
      setText("mm-prem-hs", `${p.hsKillPct.toFixed(1)}%`);
      setText("mm-prem-rating", formatSigned(p.rating, 2));
      renderFormDots("mm-prem-form", p.form);
    }

    if (compList.length > 0) {
      const c = aggregateMatches(compList);
      const tiePart = c.t > 0 ? `–${c.t}T` : "";
      setText("mm-comp-record", `${c.w}W–${c.l}L${tiePart} • ${c.wr.toFixed(1)}% WR`);
      setText("mm-comp-kd", c.kd.toFixed(2));
      setText("mm-comp-adr", c.adr.toFixed(1));
      setText("mm-comp-hs", `${c.hsKillPct.toFixed(1)}%`);
      setText("mm-comp-rating", formatSigned(c.rating, 2));
      renderFormDots("mm-comp-form", c.form);
    }

    const combinedMm = premList.concat(compList);
    if (combinedMm.length > 0) {
      const mm = aggregateMatches(combinedMm);
      setText("mm-hs-kill", `${mm.hsKillPct.toFixed(1)}% HS kills`);
      setText("mm-multi-label", `Multi-Kills (${mm.count}g)`);
      setText("mm-aces", `${mm.m5} ${mm.m5 === 1 ? "Ace" : "Aces"}`);
      setText("mm-multis", `${mm.m3}× 3K • ${mm.m4}× 4K`);
    }

    if (faceitList.length > 0) {
      const f = aggregateMatches(faceitList);
      setText("fc-recent-label", `Recent ${f.count}g`);
      setText("fc-recent-kd", `${f.kd.toFixed(2)} K/D`);
      setText("fc-recent-sub", `${f.adr.toFixed(1)} ADR • ${f.wr.toFixed(1)}% WR`);
      setText("fc-mech-label", `Mechanics (${f.count}g)`);
      setText("fc-ttd", `${Math.round(f.reactMs)} ms`);
      setText("fc-mech-sub", `${f.preaim.toFixed(1)}° preaim • ${f.csPct.toFixed(1)}% CS`);
    }
  }

  Promise.allSettled([
    fetch(PROFILE_URL).then((res) => (res.ok ? res.json() : null)),
    fetch(MATCHES_URL).then((res) => (res.ok ? res.json() : null)),
  ])
    .then(([profileRes, matchesRes]) => {
      if (profileRes.status === "fulfilled" && profileRes.value) {
        applyProfile(profileRes.value);
      }
      if (matchesRes.status === "fulfilled" && matchesRes.value) {
        applyMatches(matchesRes.value);
      }
    })
    .catch(() => {
      // Keep verified snapshot values if live requests are unavailable
    });
})();

// Live Discord Profile Card (ID: 737671991288397915) — Lanyard first, japi.rest fallback
(function initDiscordProfile() {
  const userId = "737671991288397915";
  const lanyardUrl = `https://api.lanyard.rest/v1/users/${userId}`;
  const japiUrl = `https://japi.rest/discord/v1/user/${userId}`;

  const avatarEl = document.getElementById("discord-avatar");
  const decoEl = document.getElementById("discord-deco");
  const statusEl = document.getElementById("discord-status");
  const nameEl = document.getElementById("discord-name");
  const handleEl = document.getElementById("discord-handle");
  const clanWrap = document.getElementById("discord-clan");
  const clanBadgeEl = document.getElementById("discord-clan-badge");
  const clanTagEl = document.getElementById("discord-clan-tag");
  const activityEl = document.getElementById("discord-activity");

  if (!avatarEl || !statusEl || !nameEl || !handleEl) return;

  avatarEl.addEventListener("error", () => {
    if (!avatarEl.src.endsWith("assets/discord-avatar.png")) {
      avatarEl.src = "assets/discord-avatar.png";
    }
  });

  if (decoEl) {
    decoEl.addEventListener("error", () => {
      decoEl.hidden = true;
    });
  }

  if (clanBadgeEl) {
    clanBadgeEl.addEventListener("error", () => {
      clanBadgeEl.hidden = true;
    });
  }

  function applyUserFields(user, fallbackAvatarUrl) {
    if (!user || typeof user !== "object") return;

    const displayName = user.global_name || user.display_name || user.username;
    if (displayName) nameEl.textContent = displayName;
    if (user.username) handleEl.textContent = user.username;

    if (user.avatar) {
      const ext = user.avatar.startsWith("a_") ? "gif" : "png";
      avatarEl.src = `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.${ext}?size=256`;
    } else if (fallbackAvatarUrl) {
      avatarEl.src = `${fallbackAvatarUrl}?size=256`;
    }

    if (decoEl && user.avatar_decoration_data && user.avatar_decoration_data.asset) {
      decoEl.src = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png`;
      decoEl.hidden = false;
    }

    const guild = user.primary_guild || user.clan;
    if (clanWrap && clanTagEl && guild && guild.tag) {
      clanTagEl.textContent = guild.tag;
      if (clanBadgeEl && guild.identity_guild_id && guild.badge) {
        clanBadgeEl.src = `https://cdn.discordapp.com/clan-badges/${guild.identity_guild_id}/${guild.badge}.png?size=64`;
        clanBadgeEl.hidden = false;
      } else if (clanBadgeEl) {
        clanBadgeEl.hidden = true;
      }
      clanWrap.hidden = false;
    }
  }

  function applyStatus(status) {
    const allowed = ["online", "idle", "dnd", "offline"];
    const normalized = allowed.includes(status) ? status : "offline";
    statusEl.className = `discord-status status-${normalized}`;
  }

  function applyActivity(data) {
    if (!activityEl || !data || typeof data !== "object") return;
    let text = "";

    if (data.listening_to_spotify && data.spotify && data.spotify.song) {
      text = `Listening to ${data.spotify.song} — ${data.spotify.artist || ""}`.replace(/\s—\s$/, "");
    } else if (Array.isArray(data.activities)) {
      const game = data.activities.find((a) => a && a.type === 0 && a.name);
      const custom = data.activities.find((a) => a && a.type === 4 && a.state);
      if (game) {
        text = `Playing ${game.name}`;
      } else if (custom) {
        text = custom.state;
      }
    }

    if (text) {
      activityEl.textContent = text;
      activityEl.hidden = false;
    } else {
      activityEl.hidden = true;
    }
  }

  fetch(lanyardUrl)
    .then((res) => (res.ok ? res.json() : null))
    .then((json) => {
      if (json && json.success && json.data && json.data.discord_user) {
        applyUserFields(json.data.discord_user);
        applyStatus(json.data.discord_status);
        applyActivity(json.data);
        return true;
      }
      return false;
    })
    .catch(() => false)
    .then((handled) => {
      if (handled) return null;
      return fetch(japiUrl)
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (json && json.data) {
            applyUserFields(json.data, json.data.avatarURL);
          }
        })
        .catch(() => {});
    });
})();

// Kinetic Erist Title — cycles smoothly every 3 seconds across 6 display modes
(function initKineticErist() {
  const stage = document.getElementById("erist-stage");
  if (!stage) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  let timers = [];
  let modeIndex = 0;

  function clearAllTimers() {
    timers.forEach((id) => clearTimeout(id));
    timers = [];
  }

  function later(fn, ms) {
    const id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function resetClasses() {
    stage.className = "";
  }

  // Mode 0: Typewriter
  function runTypewriter() {
    resetClasses();
    stage.classList.add("font-bricolage");
    const target = "Erist";
    let len = 0;

    function tick() {
      len += 1;
      stage.innerHTML = `${target.slice(0, len)}<span class="erist-caret" aria-hidden="true"></span>`;
      if (len < target.length) {
        later(tick, 175);
      }
    }
    stage.innerHTML = `<span class="erist-caret" aria-hidden="true"></span>`;
    later(tick, 140);
  }

  // Mode 1: Continuous Font Morph
  function runFontMorph() {
    const fonts = [
      "font-bricolage",
      "font-playfair",
      "font-orbitron",
      "font-silkscreen",
      "font-caveat",
      "font-mono",
    ];
    let step = 0;

    function tick() {
      resetClasses();
      stage.classList.add(fonts[step % fonts.length]);
      stage.textContent = "Erist";
      step += 1;
      if (step < 9) {
        later(tick, 280);
      }
    }
    tick();
  }

  // Mode 2: International Morse Code (E R I S T)
  function runMorse() {
    resetClasses();
    stage.classList.add("font-mono", "is-compact");
    const groups = ["·", "·−·", "··", "···", "−"];
    stage.innerHTML = `<span class="morse-line">${groups
      .map((g, i) => `<span class="morse-group" data-morse="${i}">${g}</span>`)
      .join("")}</span>`;

    const els = Array.from(stage.querySelectorAll(".morse-group"));
    let idx = 0;

    function pulse() {
      els.forEach((el, i) => el.classList.toggle("is-lit", i === idx));
      idx += 1;
      if (idx < els.length) {
        later(pulse, 360);
      } else {
        later(() => els.forEach((el) => el.classList.add("is-lit")), 360);
      }
    }
    later(pulse, 120);
  }

  // Mode 3: Glyph Scramble Decode
  function runScramble() {
    resetClasses();
    stage.classList.add("font-mono");
    const target = "Erist";
    const glyphs = "#/01*_+=-";
    let frame = 0;

    function tick() {
      const locked = Math.floor(frame / 4);
      let out = "";
      for (let i = 0; i < target.length; i++) {
        if (i < locked) {
          out += target[i];
        } else {
          out += glyphs[(frame * 3 + i * 5) % glyphs.length];
        }
      }
      stage.textContent = out;
      frame += 1;
      if (locked <= target.length) {
        later(tick, 65);
      } else {
        resetClasses();
        stage.classList.add("font-bricolage");
        stage.textContent = target;
      }
    }
    tick();
  }

  // Mode 4: Staggered Wave Letters
  function runWave() {
    resetClasses();
    stage.classList.add("font-bricolage");
    const chars = ["E", "r", "i", "s", "t"];
    stage.innerHTML = chars
      .map(
        (ch, i) =>
          `<span class="erist-wave-char" style="--delay:${i * 70}ms">${ch}</span>`
      )
      .join("");
  }

  // Mode 5: Binary Flash -> ERIST -> Erist
  function runBinaryFlash() {
    resetClasses();
    stage.classList.add("font-mono", "is-compact");
    stage.textContent = "01000101 01110010";
    later(() => {
      resetClasses();
      stage.classList.add("font-orbitron", "is-wide-track");
      stage.textContent = "ERIST";
    }, 750);
    later(() => {
      resetClasses();
      stage.classList.add("font-bricolage");
      stage.textContent = "Erist";
    }, 1900);
  }

  const modes = [
    runTypewriter,
    runFontMorph,
    runMorse,
    runScramble,
    runWave,
    runBinaryFlash,
  ];

  modes[modeIndex]();
  setInterval(() => {
    clearAllTimers();
    modeIndex = (modeIndex + 1) % modes.length;
    modes[modeIndex]();
  }, 3000);
})();

// Calmer Animated Water-Blowing Faded-Yellow Liquid WebGL Shader
(function initLiquidBackground() {
  const canvas = document.getElementById("liquid-bg");
  if (!canvas) return;

  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });

  if (!gl) return;

  const vertexSrc = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = a_pos * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  const fragmentSrc = `
    precision mediump float;
    varying vec2 v_uv;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform vec2 u_vel;
    uniform float u_scroll;
    uniform vec4 u_ripples[28];

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.52;
      mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = rot * p * 1.95;
        a *= 0.5;
      }
      return v;
    }

    float baseLiquidHeight(vec2 p, float t) {
      vec2 q = vec2(
        fbm(p + vec2(0.0, 0.0) + t * 0.105),
        fbm(p + vec2(5.2, 1.3) - t * 0.09)
      );
      vec2 r = vec2(
        fbm(p + 2.4 * q + vec2(1.7, 9.2) + t * 0.075),
        fbm(p + 2.4 * q + vec2(8.3, 2.8) - t * 0.08)
      );
      return fbm(p + 1.9 * r);
    }

    vec3 evalSurface(vec2 p, vec2 mPos, float aspect, float t) {
      float h = baseLiquidHeight(p, t);
      float hx = baseLiquidHeight(p + vec2(0.016, 0.0), t);
      float hy = baseLiquidHeight(p + vec2(0.0, 0.016), t);
      vec2 grad = vec2((hx - h) / 0.016, (hy - h) / 0.016);

      // Cursor air-blow wake: smooth radial depression + directional push
      vec2 toCursor = p - mPos;
      float distC = length(toCursor);
      float blowEnv = exp(-distC * 5.8);
      float wake = -0.14 * blowEnv + dot(toCursor, u_vel) * 0.45 * blowEnv;
      h += wake;
      if (distC > 0.0005) {
        vec2 dirC = toCursor / distC;
        grad += dirC * (0.14 * 5.8 * blowEnv) + u_vel * (0.45 * blowEnv);
      }

      // 28-point expanding water ripples along pointer trail
      for (int i = 0; i < 28; i++) {
        vec4 rp = u_ripples[i];
        float age = t - rp.z;
        if (rp.w > 0.001 && age > 0.0 && age < 3.1) {
          vec2 dVec = p - rp.xy;
          float d = length(dVec);
          float phase = d * 24.0 - age * 8.2;
          float env = exp(-age * 1.65) * exp(-d * 4.4) * rp.w;
          float wave = sin(phase) * env * 0.055;
          h += wave;
          if (d > 0.0005) {
            vec2 rDir = dVec / d;
            float dWave = (cos(phase) * 24.0 - sin(phase) * 4.4) * env * 0.055;
            grad += rDir * dWave;
          }
        }
      }

      return vec3(h, grad);
    }

    void main() {
      float aspect = u_resolution.x / max(u_resolution.y, 1.0);
      vec2 uv = v_uv;
      vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 1.65;
      p.y -= u_scroll * 0.35;

      vec2 mPos = (u_mouse - 0.5) * vec2(aspect, 1.0) * 1.65;
      mPos.y -= u_scroll * 0.35;

      vec3 surf = evalSurface(p, mPos, aspect, u_time);
      float h = surf.x;
      vec3 normal = normalize(vec3(-surf.y * 1.35, -surf.z * 1.35, 1.0));

      vec3 ivory   = vec3(1.000, 0.992, 0.960); // #FFFDF5
      vec3 butter  = vec3(0.996, 0.945, 0.686); // #FEF1AF
      vec3 sunGold = vec3(0.969, 0.824, 0.298); // #F7D24C
      vec3 amber   = vec3(0.890, 0.663, 0.110); // #E3A91C

      vec3 base = mix(amber, sunGold, smoothstep(0.18, 0.45, h));
      base = mix(base, butter, smoothstep(0.42, 0.70, h));
      base = mix(base, ivory, smoothstep(0.68, 0.96, h));

      vec3 lightDir = normalize(vec3(-0.35, 0.58, 0.74));
      float spec = pow(max(dot(normal, lightDir), 0.0), 14.0);
      vec3 col = mix(base, ivory, clamp(spec * 0.58, 0.0, 0.72));

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = compile(gl.VERTEX_SHADER, vertexSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const aPos = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "u_resolution");
  const uTime = gl.getUniformLocation(program, "u_time");
  const uMouse = gl.getUniformLocation(program, "u_mouse");
  const uVel = gl.getUniformLocation(program, "u_vel");
  const uScroll = gl.getUniformLocation(program, "u_scroll");
  const uRipples = gl.getUniformLocation(program, "u_ripples");

  const MAX_RIPPLES = 28;
  const ripples = new Float32Array(MAX_RIPPLES * 4);
  for (let i = 0; i < MAX_RIPPLES; i++) {
    ripples[i * 4 + 2] = -99.0;
  }
  let rippleHead = 0;

  let targetMouseX = 0.5;
  let targetMouseY = 0.5;
  let mouseX = 0.5;
  let mouseY = 0.5;
  let velX = 0;
  let velY = 0;
  let lastSpawnX = 0.5;
  let lastSpawnY = 0.5;
  let lastSpawnTime = 0;

  const startTime = performance.now();

  function currentTimeSec() {
    return (performance.now() - startTime) * 0.001;
  }

  function toShaderSpace(uvX, uvY) {
    const aspect = window.innerWidth / Math.max(window.innerHeight, 1);
    const scrollFrac =
      window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const px = (uvX - 0.5) * aspect * 1.65;
    const py = (uvY - 0.5) * 1.65 - scrollFrac * 0.35;
    return [px, py];
  }

  function pushRipple(uvX, uvY, strength) {
    const [px, py] = toShaderSpace(uvX, uvY);
    const base = rippleHead * 4;
    ripples[base] = px;
    ripples[base + 1] = py;
    ripples[base + 2] = currentTimeSec();
    ripples[base + 3] = strength;
    rippleHead = (rippleHead + 1) % MAX_RIPPLES;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.floor(window.innerWidth * dpr));
    const h = Math.max(1, Math.floor(window.innerHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  window.addEventListener("resize", resize);

  window.addEventListener(
    "pointermove",
    (e) => {
      const nx = e.clientX / Math.max(window.innerWidth, 1);
      const ny = 1.0 - e.clientY / Math.max(window.innerHeight, 1);

      const dx = nx - targetMouseX;
      const dy = ny - targetMouseY;
      velX = Math.max(-0.85, Math.min(0.85, velX * 0.5 + dx * 18.0));
      velY = Math.max(-0.85, Math.min(0.85, velY * 0.5 + dy * 18.0));

      targetMouseX = nx;
      targetMouseY = ny;

      const distMoved = Math.hypot(nx - lastSpawnX, ny - lastSpawnY);
      const now = performance.now();
      if (distMoved >= 0.014 || (distMoved >= 0.004 && now - lastSpawnTime >= 28)) {
        const strength = Math.max(0.55, Math.min(1.25, distMoved * 26.0));
        pushRipple(nx, ny, strength);
        lastSpawnX = nx;
        lastSpawnY = ny;
        lastSpawnTime = now;
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerdown",
    (e) => {
      const nx = e.clientX / Math.max(window.innerWidth, 1);
      const ny = 1.0 - e.clientY / Math.max(window.innerHeight, 1);
      pushRipple(nx, ny, 1.45);
    },
    { passive: true }
  );

  resize();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function render() {
    mouseX += (targetMouseX - mouseX) * 0.14;
    mouseY += (targetMouseY - mouseY) * 0.14;
    velX *= 0.9;
    velY *= 0.9;

    const scrollFrac =
      window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, currentTimeSec());
    gl.uniform2f(uMouse, mouseX, mouseY);
    gl.uniform2f(uVel, velX, velY);
    gl.uniform1f(uScroll, scrollFrac);
    gl.uniform4fv(uRipples, ripples);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (!prefersReducedMotion) {
      requestAnimationFrame(render);
    }
  }

  requestAnimationFrame(render);
})();

// Always-Visible Bottom-Right Background Music Timeline (YouTube IFrame Player API)
(function initBackgroundMusic() {
  const VIDEO_ID = "rYWLIJB214Q";
  const DEFAULT_DURATION = 315;
  const DEFAULT_VOL = 35;
  const VOL_KEY = "erist_bgm_vol";

  const playerEl = document.getElementById("bgm-player");
  const mountEl = document.getElementById("bgm-yt-mount");
  const toggleBtn = document.getElementById("bgm-toggle");
  const icoPlay = document.getElementById("bgm-ico-play");
  const icoPause = document.getElementById("bgm-ico-pause");
  const muteBtn = document.getElementById("bgm-mute");
  const icoVol = document.getElementById("bgm-ico-vol");
  const icoMuted = document.getElementById("bgm-ico-muted");
  const volEl = document.getElementById("bgm-vol");
  const seekEl = document.getElementById("bgm-seek");
  const curEl = document.getElementById("bgm-cur");
  const durEl = document.getElementById("bgm-dur");
  const noteEl = document.getElementById("bgm-note");

  if (!playerEl || !mountEl || !toggleBtn || !muteBtn || !volEl || !seekEl || !curEl || !durEl) {
    return;
  }

  let player = null;
  let playerReady = false;
  let isPlaying = false;
  let isMuted = false;
  let isSeeking = false;
  let userPaused = false;
  let pendingPlay = false;
  let tickTimer = null;

  let vol = DEFAULT_VOL;
  try {
    const saved = Number(localStorage.getItem(VOL_KEY));
    if (!Number.isNaN(saved) && saved >= 0 && saved <= 100) {
      vol = saved;
    }
  } catch {
    // Ignore storage restriction
  }

  function formatTime(sec) {
    if (!Number.isFinite(sec) || sec < 0) return "0:00";
    const whole = Math.floor(sec);
    const m = Math.floor(whole / 60);
    const s = whole % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function setRangeFill(input) {
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const val = Number(input.value || 0);
    const span = Math.max(0.0001, max - min);
    const pct = Math.max(0, Math.min(100, ((val - min) / span) * 100));
    input.style.setProperty("--fill", `${pct.toFixed(2)}%`);
  }

  function setSvgHidden(el, shouldHide) {
    if (!el) return;
    if (shouldHide) el.setAttribute("hidden", "");
    else el.removeAttribute("hidden");
  }

  function updatePlayUI(playing) {
    isPlaying = playing;
    playerEl.classList.toggle("is-playing", playing);
    toggleBtn.setAttribute("aria-pressed", playing ? "true" : "false");
    toggleBtn.setAttribute("aria-label", playing ? "Tạm dừng nhạc nền" : "Phát nhạc nền");
    setSvgHidden(icoPlay, playing);
    setSvgHidden(icoPause, !playing);
  }

  function updateMuteUI(muted) {
    isMuted = muted;
    muteBtn.setAttribute("aria-label", muted ? "Bật tiếng" : "Tắt tiếng");
    setSvgHidden(icoVol, muted);
    setSvgHidden(icoMuted, !muted);
  }

  function stopTicker() {
    if (tickTimer) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  }

  function syncTimeline() {
    if (!playerReady || !player || isSeeking) return;
    const dur =
      typeof player.getDuration === "function" && player.getDuration() > 0
        ? player.getDuration()
        : DEFAULT_DURATION;
    const cur = typeof player.getCurrentTime === "function" ? player.getCurrentTime() : 0;
    seekEl.max = String(Math.round(dur));
    seekEl.value = String(Math.min(dur, cur));
    setRangeFill(seekEl);
    curEl.textContent = formatTime(cur);
    durEl.textContent = formatTime(dur);
  }

  function startTicker() {
    stopTicker();
    syncTimeline();
    tickTimer = setInterval(syncTimeline, 250);
  }

  function showNote(text) {
    if (!noteEl) return;
    noteEl.textContent = text;
    noteEl.hidden = !text;
  }

  volEl.value = String(vol);
  setRangeFill(volEl);
  updateMuteUI(vol === 0);
  setRangeFill(seekEl);

  function startPlayback() {
    if (!player || typeof player.playVideo !== "function") return;
    if (!isMuted && vol > 0 && typeof player.unMute === "function") {
      player.unMute();
      player.setVolume(vol);
    }
    player.playVideo();
  }

  function createPlayer() {
    if (player || !window.YT || typeof window.YT.Player !== "function") return;
    const playerVars = {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      loop: 1,
      playlist: VIDEO_ID,
    };
    if (window.location.protocol.startsWith("http")) {
      playerVars.origin = window.location.origin;
    }

    player = new window.YT.Player("bgm-yt-mount", {
      width: 200,
      height: 112,
      videoId: VIDEO_ID,
      playerVars,
      events: {
        onReady: () => {
          playerReady = true;
          if (typeof player.setVolume === "function") {
            player.setVolume(vol);
          }
          if (vol === 0 && typeof player.mute === "function") {
            player.mute();
          }
          const dur =
            typeof player.getDuration === "function" && player.getDuration() > 0
              ? player.getDuration()
              : DEFAULT_DURATION;
          seekEl.max = String(Math.round(dur));
          durEl.textContent = formatTime(dur);
          setRangeFill(seekEl);
          playerEl.dataset.state = "ready";
          if (pendingPlay && !userPaused) {
            startPlayback();
          }
        },
        onStateChange: (e) => {
          const S = window.YT.PlayerState;
          if (e.data === S.PLAYING) {
            pendingPlay = false;
            delete playerEl.dataset.error;
            playerEl.dataset.state = "playing";
            showNote("");
            updatePlayUI(true);
            startTicker();
          } else if (e.data === S.PAUSED) {
            playerEl.dataset.state = "paused";
            updatePlayUI(false);
            stopTicker();
          } else if (e.data === S.BUFFERING) {
            playerEl.dataset.state = "buffering";
          } else if (e.data === S.ENDED) {
            if (typeof player.seekTo === "function") {
              player.seekTo(0, true);
              player.playVideo();
            }
          }
        },
        onError: (e) => {
          playerEl.dataset.error = String(e.data);
          playerEl.dataset.state = "error";
          updatePlayUI(false);
          stopTicker();
          const msg =
            e.data === 101 || e.data === 150
              ? "Bài này bị chủ bản quyền tắt nhúng ngoài YouTube — bấm tên bài để nghe trên YouTube hoặc đổi link khác."
              : "Không thể tải nhạc YouTube lúc này.";
          showNote(msg);
        },
      },
    });
  }

  toggleBtn.addEventListener("click", () => {
    if (isPlaying) {
      userPaused = true;
      pendingPlay = false;
      if (playerReady && player && typeof player.pauseVideo === "function") {
        player.pauseVideo();
      }
      return;
    }
    userPaused = false;
    if (playerReady) {
      startPlayback();
    } else {
      pendingPlay = true;
    }
  });

  muteBtn.addEventListener("click", () => {
    const nextMuted = !isMuted;
    updateMuteUI(nextMuted);
    if (!nextMuted && vol === 0) {
      vol = DEFAULT_VOL;
      volEl.value = String(vol);
      setRangeFill(volEl);
      try {
        localStorage.setItem(VOL_KEY, String(vol));
      } catch {
        // Ignore storage error
      }
    }
    if (playerReady && player) {
      if (nextMuted) {
        if (typeof player.mute === "function") player.mute();
      } else {
        if (typeof player.unMute === "function") player.unMute();
        if (typeof player.setVolume === "function") player.setVolume(vol);
      }
    }
  });

  volEl.addEventListener("input", () => {
    vol = Number(volEl.value);
    setRangeFill(volEl);
    try {
      localStorage.setItem(VOL_KEY, String(vol));
    } catch {
      // Ignore storage error
    }
    updateMuteUI(vol === 0);
    if (playerReady && player) {
      if (vol === 0) {
        if (typeof player.mute === "function") player.mute();
      } else {
        if (typeof player.unMute === "function") player.unMute();
        if (typeof player.setVolume === "function") player.setVolume(vol);
      }
    }
  });

  ["pointerdown", "mousedown", "touchstart"].forEach((evt) => {
    seekEl.addEventListener(
      evt,
      () => {
        isSeeking = true;
      },
      { passive: true }
    );
  });

  seekEl.addEventListener("input", () => {
    setRangeFill(seekEl);
    curEl.textContent = formatTime(Number(seekEl.value));
  });

  function commitSeek() {
    const targetSec = Number(seekEl.value);
    isSeeking = false;
    setRangeFill(seekEl);
    curEl.textContent = formatTime(targetSec);
    if (playerReady && player && typeof player.seekTo === "function") {
      player.seekTo(targetSec, true);
    }
  }

  ["change", "pointerup", "mouseup", "touchend"].forEach((evt) => {
    seekEl.addEventListener(evt, commitSeek);
  });

  function cleanupGesture() {
    document.removeEventListener("pointerdown", onFirstGesture);
    document.removeEventListener("keydown", onFirstGesture);
  }

  function onFirstGesture(e) {
    if (e.target && typeof e.target.closest === "function" && e.target.closest("#bgm-player")) {
      return;
    }
    cleanupGesture();
    if (userPaused || isPlaying) return;
    if (playerReady) {
      startPlayback();
    } else {
      pendingPlay = true;
    }
  }

  document.addEventListener("pointerdown", onFirstGesture, { passive: true });
  document.addEventListener("keydown", onFirstGesture);

  if (window.YT && typeof window.YT.Player === "function") {
    createPlayer();
  } else {
    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevReady === "function") prevReady();
      createPlayer();
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }
  }
})();

// STARRY Pop-up 3x3 Mini-Game (Ijichi Nijika Drummer Edition)
(function initStarryGame() {
  const BEST_KEY = "erist_starry_best";
  const ROUND_SECONDS = 30;
  const MAX_LIVES = 3;
  const SPRITES = {
    crate: "assets/game-starry/crate-empty.png",
    nijika: "assets/game-starry/pop-nijika.png",
    dorito: "assets/game-starry/pop-dorito.png",
    bocchi: "assets/game-starry/pop-bocchi.png",
    stick: "assets/game-starry/drumstick.png",
  };

  const board = document.getElementById("starry-board");
  const cells = Array.from(document.querySelectorAll(".starry-cell"));
  const stickEl = document.getElementById("starry-stick");
  const overlayEl = document.getElementById("starry-overlay");
  const ovTitleEl = document.getElementById("starry-ov-title");
  const ovSubEl = document.getElementById("starry-ov-sub");
  const ovResultEl = document.getElementById("starry-ov-result");
  const playBtn = document.getElementById("starry-play-btn");
  const startBtn = document.getElementById("starry-start");
  const sfxBtn = document.getElementById("starry-sfx");
  const sfxOnIcon = document.getElementById("starry-ico-sfx-on");
  const sfxOffIcon = document.getElementById("starry-ico-sfx-off");
  const scoreEl = document.getElementById("starry-score");
  const comboEl = document.getElementById("starry-combo");
  const timeEl = document.getElementById("starry-time");
  const bestEl = document.getElementById("starry-best");
  const livesWrap = document.getElementById("starry-lives");
  const hearts = livesWrap ? Array.from(livesWrap.querySelectorAll(".starry-heart")) : [];

  if (!board || cells.length !== 9 || !overlayEl || !playBtn || !startBtn) {
    return;
  }

  // Preload all 5 PNG sprites for zero-flicker pop-ups
  Object.values(SPRITES).forEach((src) => {
    const pre = new Image();
    pre.src = src;
  });

  let bestScore = 0;
  try {
    const saved = Number(localStorage.getItem(BEST_KEY));
    if (!Number.isNaN(saved) && saved > 0) bestScore = saved;
  } catch {
    // Ignore storage error
  }
  if (bestEl) bestEl.textContent = String(bestScore);

  let running = false;
  let score = 0;
  let combo = 0;
  let maxCombo = 0;
  let timeLeft = ROUND_SECONDS;
  let lives = MAX_LIVES;
  let sfxOn = true;
  let lastSlot = -1;

  let roundTimer = null;
  let spawnTimer = null;
  let stickStrikeTimer = null;
  let stickTouchHideTimer = null;
  let audioCtx = null;

  const activeSlots = new Map();

  function setSvgHidden(el, shouldHide) {
    if (!el) return;
    if (shouldHide) el.setAttribute("hidden", "");
    else el.removeAttribute("hidden");
  }

  function playSfx(kind, currentCombo) {
    if (!sfxOn) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }

    const now = audioCtx.currentTime;
    const gain = audioCtx.createGain();
    const osc = audioCtx.createOscillator();

    if (kind === "nijika") {
      const pitchBoost = Math.min(currentCombo, 10) * 18;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220 + pitchBoost, now);
      osc.frequency.exponentialRampToValueAtTime(95, now + 0.09);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (kind === "dorito") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.setValueAtTime(990, now + 0.055);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.17);
    } else {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(165, now);
      osc.frequency.linearRampToValueAtTime(92, now + 0.18);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  }

  function updateHud() {
    if (scoreEl) scoreEl.textContent = String(score);
    if (comboEl) comboEl.textContent = `x${combo}`;
    if (timeEl) timeEl.textContent = `${timeLeft}s`;
    if (bestEl) bestEl.textContent = String(bestScore);
    if (livesWrap) livesWrap.setAttribute("aria-label", `Còn ${Math.max(0, lives)} tim`);
    hearts.forEach((h, i) => {
      h.classList.toggle("is-lost", i >= lives);
    });
  }

  function clearCell(slotIdx) {
    const cell = cells[slotIdx];
    const state = activeSlots.get(slotIdx);
    if (state && state.timeoutId) clearTimeout(state.timeoutId);
    activeSlots.delete(slotIdx);
    if (!cell) return;
    cell.classList.remove("is-active");
    delete cell.dataset.kind;
  }

  function clearAllCells() {
    for (let i = 0; i < cells.length; i++) {
      clearCell(i);
    }
  }

  function triggerFx(cell, text, cls) {
    const fx = cell.querySelector(".starry-fx");
    if (!fx) return;
    fx.className = `starry-fx ${cls}`;
    fx.textContent = text;
    void fx.offsetWidth;
    fx.classList.add("is-pop");
  }

  function positionStickAt(boardX, boardY, transient) {
    if (!stickEl) return;
    const w = stickEl.offsetWidth || 72;
    const h = stickEl.offsetHeight || 103;
    // Anchor bottom-left tip (~14% X, ~90% Y) right on pointer coordinates
    const tx = Math.round(boardX - w * 0.14);
    const ty = Math.round(boardY - h * 0.9);
    stickEl.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    stickEl.classList.add("is-visible");
    if (transient) {
      if (stickTouchHideTimer) clearTimeout(stickTouchHideTimer);
      stickTouchHideTimer = setTimeout(() => {
        stickEl.classList.remove("is-visible");
      }, 260);
    }
  }

  function animateStrike() {
    if (!stickEl) return;
    if (stickStrikeTimer) clearTimeout(stickStrikeTimer);
    stickEl.classList.remove("is-striking");
    void stickEl.offsetWidth;
    stickEl.classList.add("is-striking");
    stickStrikeTimer = setTimeout(() => {
      stickEl.classList.remove("is-striking");
    }, 115);
  }

  function spawnOne() {
    if (!running) return;
    const elapsed = ROUND_SECONDS - timeLeft;
    const maxActive = elapsed >= 15 ? 3 : 2;
    if (activeSlots.size >= maxActive) return;

    const freeSlots = [];
    for (let i = 0; i < cells.length; i++) {
      if (!activeSlots.has(i) && i !== lastSlot) freeSlots.push(i);
    }
    if (freeSlots.length === 0) return;

    const slot = freeSlots[Math.floor(Math.random() * freeSlots.length)];
    lastSlot = slot;

    const roll = Math.random();
    const kind = roll < 0.58 ? "nijika" : roll < 0.74 ? "dorito" : "bocchi";
    const cell = cells[slot];
    const popImg = cell.querySelector(".starry-pop");
    if (!popImg) return;

    popImg.src = SPRITES[kind];
    popImg.hidden = false;
    cell.dataset.kind = kind;
    void popImg.offsetWidth;
    cell.classList.add("is-active");

    const progress = elapsed / ROUND_SECONDS;
    const baseStay = 1220 - progress * 460;
    const stayMs = Math.round(kind === "dorito" ? baseStay * 0.84 : baseStay);

    const timeoutId = setTimeout(() => {
      clearCell(slot);
    }, stayMs);

    activeSlots.set(slot, { kind, hit: false, timeoutId });
  }

  function scheduleNextSpawn() {
    if (!running) return;
    spawnOne();
    const progress = (ROUND_SECONDS - timeLeft) / ROUND_SECONDS;
    const delay = Math.round(800 - progress * 340 + (Math.random() * 140 - 70));
    spawnTimer = setTimeout(scheduleNextSpawn, Math.max(360, delay));
  }

  function rankLabel(s) {
    if (s >= 420) return "Kessoku Headliner";
    if (s >= 260) return "STARRY Ace Drummer";
    if (s >= 140) return "Live House Regular";
    return "Soundcheck Trainee";
  }

  function endGame(outOfLives) {
    running = false;
    if (roundTimer) clearInterval(roundTimer);
    if (spawnTimer) clearTimeout(spawnTimer);
    roundTimer = null;
    spawnTimer = null;
    clearAllCells();
    board.classList.remove("is-playing");
    if (stickEl) stickEl.classList.remove("is-visible", "is-striking");

    let isNewBest = false;
    if (score > bestScore) {
      bestScore = score;
      isNewBest = true;
      try {
        localStorage.setItem(BEST_KEY, String(bestScore));
      } catch {
        // Ignore storage error
      }
    }
    updateHud();

    if (ovTitleEl) ovTitleEl.textContent = outOfLives ? "Bocchi tan chảy mất rồi!" : "Hết giờ diễn!";
    if (ovSubEl) {
      ovSubEl.textContent = isNewBest
        ? `Kỷ lục mới: ${score} điểm • ${rankLabel(score)}`
        : `Hạng: ${rankLabel(score)} — Thử lại để phá mốc ${bestScore}!`;
    }
    if (ovResultEl) {
      ovResultEl.textContent = `Score: ${score} • Max Combo: x${maxCombo} • Best: ${bestScore}`;
      ovResultEl.hidden = false;
    }
    playBtn.textContent = "Chơi lại";
    startBtn.textContent = "Chơi lại";
    overlayEl.hidden = false;
  }

  function startGame() {
    if (roundTimer) clearInterval(roundTimer);
    if (spawnTimer) clearTimeout(spawnTimer);
    clearAllCells();

    score = 0;
    combo = 0;
    maxCombo = 0;
    timeLeft = ROUND_SECONDS;
    lives = MAX_LIVES;
    lastSlot = -1;
    running = true;

    overlayEl.hidden = true;
    board.classList.add("is-playing");
    startBtn.textContent = "Chơi lại";
    updateHud();

    roundTimer = setInterval(() => {
      if (!running) return;
      timeLeft -= 1;
      updateHud();
      if (timeLeft <= 0) {
        endGame(false);
      }
    }, 1000);

    scheduleNextSpawn();
  }

  function hitSlot(slotIdx, pointerEvent) {
    if (!running) return;
    const cell = cells[slotIdx];
    if (!cell) return;

    const boardRect = board.getBoundingClientRect();
    if (pointerEvent && typeof pointerEvent.clientX === "number" && pointerEvent.clientX > 0) {
      const x = pointerEvent.clientX - boardRect.left;
      const y = pointerEvent.clientY - boardRect.top;
      positionStickAt(x, y, pointerEvent.pointerType !== "mouse");
    } else {
      const cellRect = cell.getBoundingClientRect();
      positionStickAt(
        cellRect.left - boardRect.left + cellRect.width * 0.5,
        cellRect.top - boardRect.top + cellRect.height * 0.48,
        true
      );
    }
    animateStrike();

    const state = activeSlots.get(slotIdx);
    if (!state || state.hit) {
      if (!state && combo > 0) {
        combo = 0;
        updateHud();
      }
      return;
    }

    state.hit = true;
    if (state.kind === "nijika") {
      combo += 1;
      if (combo > maxCombo) maxCombo = combo;
      const pts = 10 + Math.min(combo - 1, 10) * 2;
      score += pts;
      cell.classList.add("is-hit-good");
      triggerFx(cell, `+${pts}`, "fx-good");
      playSfx("nijika", combo);
    } else if (state.kind === "dorito") {
      combo += 2;
      if (combo > maxCombo) maxCombo = combo;
      const pts = 30 + Math.min(combo, 12) * 2;
      score += pts;
      cell.classList.add("is-hit-good");
      triggerFx(cell, `+${pts} ★`, "fx-dorito");
      playSfx("dorito", combo);
    } else {
      lives -= 1;
      combo = 0;
      cell.classList.add("is-hit-bad");
      triggerFx(cell, "−1 ♥", "fx-bad");
      board.classList.remove("is-shake");
      void board.offsetWidth;
      board.classList.add("is-shake");
      playSfx("bocchi", 0);
    }

    updateHud();
    setTimeout(() => {
      cell.classList.remove("is-hit-good", "is-hit-bad");
      clearCell(slotIdx);
      if (running && lives <= 0) {
        endGame(true);
      }
    }, 110);
  }

  board.addEventListener("pointermove", (e) => {
    if (!running || e.pointerType !== "mouse") return;
    const rect = board.getBoundingClientRect();
    positionStickAt(e.clientX - rect.left, e.clientY - rect.top, false);
  });

  board.addEventListener("pointerleave", () => {
    if (stickEl) stickEl.classList.remove("is-visible");
  });

  cells.forEach((cell) => {
    cell.addEventListener("pointerdown", (e) => {
      if (!running) return;
      e.preventDefault();
      hitSlot(Number(cell.dataset.slot), e);
    });
  });

  const KEY_TO_SLOT = {
    q: 0, w: 1, e: 2,
    a: 3, s: 4, d: 5,
    z: 6, x: 7, c: 8,
    "1": 0, "2": 1, "3": 2,
    "4": 3, "5": 4, "6": 5,
    "7": 6, "8": 7, "9": 8,
  };

  document.addEventListener("keydown", (e) => {
    if (!running || e.repeat) return;
    const tag = e.target && e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    const slot = KEY_TO_SLOT[e.key.toLowerCase()];
    if (typeof slot === "number") {
      hitSlot(slot, null);
    }
  });

  playBtn.addEventListener("click", startGame);
  startBtn.addEventListener("click", startGame);

  if (sfxBtn) {
    sfxBtn.addEventListener("click", () => {
      sfxOn = !sfxOn;
      sfxBtn.setAttribute("aria-pressed", sfxOn ? "false" : "true");
      sfxBtn.setAttribute("aria-label", sfxOn ? "Tắt âm thanh game" : "Bật âm thanh game");
      setSvgHidden(sfxOnIcon, !sfxOn);
      setSvgHidden(sfxOffIcon, sfxOn);
    });
  }
})();
