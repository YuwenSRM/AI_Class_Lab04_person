(function () {
  "use strict";

  var STORAGE_KEY = "portfolio-theme";
  var root = document.documentElement;
  var themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function readStoredTheme() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return value === "dark" || value === "light" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    if (themeColorMeta) {
      themeColorMeta.setAttribute(
        "content",
        theme === "dark" ? "#0b0b0d" : "#fbfbfd"
      );
    }
  }

  applyTheme(readStoredTheme() || "light");

  function setupThemeButtons() {
    var buttons = Array.prototype.slice.call(
      document.querySelectorAll("[data-theme-toggle]")
    );

    if (!buttons.length) {
      return;
    }

    function syncButtons() {
      var isDark = root.getAttribute("data-theme") === "dark";

      buttons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(isDark));
        button.setAttribute(
          "aria-label",
          isDark ? "切换到日间模式" : "切换到夜间模式"
        );

        var label = button.querySelector(".theme-toggle__label");
        if (label) {
          label.textContent = isDark ? "日间模式" : "夜间模式";
        }
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var nextTheme =
          root.getAttribute("data-theme") === "dark" ? "light" : "dark";

        applyTheme(nextTheme);
        syncButtons();

        try {
          window.localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch (error) {
          // 本地存储不可用时，主题切换仍然生效，只是不保存偏好。
        }
      });
    });

    syncButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupThemeButtons);
  } else {
    setupThemeButtons();
  }
})();
