(function () {
  "use strict";

  var projects = Array.isArray(window.PORTFOLIO_PROJECTS)
    ? window.PORTFOLIO_PROJECTS
    : [];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var projectList = document.getElementById("projectList");
  var filterBar = document.getElementById("projectFilters");
  var projectCount = document.getElementById("projectCount");
  var yearElement = document.getElementById("year");
  var backToTop = document.getElementById("backToTop");
  var menuButton = document.getElementById("mobileMenuButton");
  var mobileNav = document.getElementById("mobileNav");

  var activeCategory = "全部";

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function projectTemplate(project) {
    var index = projects.indexOf(project);
    var classes = ["project"];
    var stack = (project.stack || [])
      .map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      })
      .join("");
    var highlight = project.highlight
      ? '<p class="project__highlight">' + escapeHtml(project.highlight) + "</p>"
      : "";
    var badge = project.featured
      ? '<span class="project__badge">Featured</span>'
      : "";
    var tag = project.tag
      ? '<span class="project__tag">' + escapeHtml(project.tag) + "</span>"
      : "";
    var link = "";

    if (project.link) {
      var isExternal = /^https?:\/\//i.test(project.link);
      link =
        '<a class="project__link" href="' +
        escapeHtml(project.link) +
        '"' +
        (isExternal ? ' target="_blank" rel="noopener noreferrer"' : "") +
        '>查看项目详情 <span aria-hidden="true">→</span></a>';
    }

    if (project.featured) {
      classes.push("project--featured");
    } else if (index % 2 === 1) {
      classes.push("project--reverse");
    }

    return (
      '<article class="' +
      classes.join(" ") +
      '" id="project-' +
      escapeHtml(project.id) +
      '" data-category="' +
      escapeHtml(project.category) +
      '">' +
      '<div class="project__media">' +
      '<img src="' +
      escapeHtml(project.image) +
      '" alt="' +
      escapeHtml(project.alt || project.title + " 项目封面") +
      '" width="1600" height="1000" loading="eager" decoding="sync">' +
      badge +
      "</div>" +
      '<div class="project__body">' +
      '<p class="project__meta">' +
      '<span class="project__index">' +
      String(index + 1).padStart(2, "0") +
      "</span>" +
      '<span class="project__category">' +
      escapeHtml(project.category) +
      "</span>" +
      '<span class="project__date">' +
      escapeHtml(project.date) +
      "</span>" +
      "</p>" +
      tag +
      '<h3 class="project__title">' +
      escapeHtml(project.title) +
      "</h3>" +
      '<p class="project__summary">' +
      escapeHtml(project.summary) +
      "</p>" +
      '<div class="project__details">' +
      '<div class="project__stack-wrap">' +
      '<p class="project__label">技术栈</p>' +
      '<ul class="project__stack">' +
      stack +
      "</ul>" +
      "</div>" +
      highlight +
      link +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function updateProjectCount(items) {
    if (!projectCount) {
      return;
    }

    if (activeCategory === "全部") {
      projectCount.textContent = "共 " + items.length + " 个项目";
    } else {
      projectCount.textContent =
        items.length + " 个项目 · 当前类别：" + activeCategory;
    }
  }

  function renderProjects(items) {
    if (!projectList) {
      return;
    }

    if (!items.length) {
      projectList.innerHTML =
        '<p class="noscript">当前类别下还没有项目，切换其他类别看看。</p>';
      updateProjectCount(items);
      return;
    }

    projectList.innerHTML = items.map(projectTemplate).join("");
    updateProjectCount(items);
  }

  function getCategories() {
    var categories = ["全部"];

    projects.forEach(function (project) {
      if (project.category && categories.indexOf(project.category) === -1) {
        categories.push(project.category);
      }
    });

    return categories;
  }

  function renderFilters() {
    if (!filterBar) {
      return;
    }

    filterBar.innerHTML = getCategories()
      .map(function (category) {
        var isActive = category === activeCategory;
        return (
          '<button class="filter-button' +
          (isActive ? " is-active" : "") +
          '" type="button" data-filter="' +
          escapeHtml(category) +
          '" aria-pressed="' +
          isActive +
          '">' +
          escapeHtml(category) +
          "</button>"
        );
      })
      .join("");
  }

  function selectCategory(category) {
    activeCategory = category;

    if (filterBar) {
      filterBar.querySelectorAll(".filter-button").forEach(function (button) {
        var isActive = button.dataset.filter === category;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    }

    renderProjects(
      category === "全部"
        ? projects
        : projects.filter(function (project) {
            return project.category === category;
          })
    );
  }

  function setupFilters() {
    if (!filterBar) {
      return;
    }

    renderFilters();
    filterBar.addEventListener("click", function (event) {
      var button = event.target.closest("[data-filter]");
      if (!button) {
        return;
      }
      selectCategory(button.dataset.filter);
    });
  }

  function setupNavigation() {
    var navLinks = Array.prototype.slice.call(
      document.querySelectorAll("[data-nav]")
    );
    var sections = Array.prototype.slice
      .call(document.querySelectorAll("[data-section]"))
      .filter(function (section) {
        return navLinks.some(function (link) {
          return link.dataset.nav === section.id;
        });
      });

    function updateActiveNav() {
      if (!sections.length) {
        return;
      }

      var marker = window.innerHeight * 0.34;
      var current = sections[0];

      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= marker) {
          current = section;
        }
      });

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sections[sections.length - 1];
      }

      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.dataset.nav === current.id);
      });
    }

    updateActiveNav();
    window.addEventListener("scroll", updateActiveNav, { passive: true });
    window.addEventListener("resize", updateActiveNav);
  }

  function setMobileMenu(isOpen) {
    if (!menuButton || !mobileNav) {
      return;
    }

    document.body.classList.toggle("menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    mobileNav.setAttribute("aria-hidden", String(!isOpen));
    mobileNav.toggleAttribute("inert", !isOpen);
  }

  function setupMobileMenu() {
    if (!menuButton || !mobileNav) {
      return;
    }

    menuButton.addEventListener("click", function () {
      setMobileMenu(!document.body.classList.contains("menu-open"));
    });

    mobileNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setMobileMenu(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
        setMobileMenu(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024) {
        setMobileMenu(false);
      }
    });
  }

  function setupCopyButtons() {
    document.querySelectorAll("[data-copy]").forEach(function (button) {
      button.addEventListener("click", function () {
        var text = button.dataset.copy;
        var label = button.querySelector(".copy-label") || button;
        var originalText = label.textContent;

        function markCopied() {
          button.classList.add("is-copied");
          label.textContent = "已复制";
          window.setTimeout(function () {
            button.classList.remove("is-copied");
            label.textContent = originalText;
          }, 1800);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(markCopied).catch(function () {
            fallbackCopy(text);
          });
          return;
        }

        fallbackCopy(text);

        function fallbackCopy(value) {
          var textarea = document.createElement("textarea");
          textarea.value = value;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.top = "-1000px";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();

          try {
            document.execCommand("copy");
            markCopied();
          } catch (error) {
            label.textContent = "复制失败";
            window.setTimeout(function () {
              label.textContent = originalText;
            }, 1800);
          }

          textarea.remove();
        }
      });
    });
  }

  function setupBackToTop() {
    if (!backToTop) {
      return;
    }

    function toggleVisibility() {
      backToTop.classList.toggle("is-visible", window.scrollY > 520);
    }

    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });

    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
  }

  function init() {
    if (yearElement) {
      yearElement.textContent = String(new Date().getFullYear());
    }

    setupFilters();
    renderProjects(projects);
    setupNavigation();
    setupMobileMenu();
    setupCopyButtons();
    setupBackToTop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
