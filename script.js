(() => {
  "use strict";

  /* CONFIG */

  const WHATSAPP_NUMBER = "2347087554590";

  const whatsappBase = `https://wa.me/${WHATSAPP_NUMBER}`;

  /* INVENTORY DATA */

  const inventory = [
    {
      id: "iphone-7-plus",
      name: "iPhone 7 Plus",
      shortName: "7 Plus",
      color: "Product Red",
      price: "₦85,000",
      condition: "Clean Used",
      badge: "Available",
      description:
        "A reliable classic with a large display, dual-camera system, and solid everyday performance.",
      image: "assets/7plus_front.jpg",
      backImage: "assets/7plus_back.jpg",
      specs: {
        Storage: "128GB",
        "Battery Health": "To be confirmed",
        "Face ID": "Not applicable",
        "Network": "Factory Unlocked",
        Condition: "Clean Used",
      },
    },
    {
      id: "iphone-8-plus",
      name: "iPhone 8 Plus",
      shortName: "8 Plus",
      color: "Gold",
      price: "₦125,000",
      condition: "Clean Used",
      badge: "Available",
      description:
        "A premium-feeling iPhone with a spacious display, strong performance, and classic Apple build quality.",
      image: "assets/8plus_front.jpg",
      backImage: "assets/8plus_back.jpg",
      specs: {
        Storage: "64GB",
        "Battery Health": "To be confirmed",
        "Touch ID": "Working",
        "Network": "Factory Unlocked",
        Condition: "Clean Used",
      },
    },
    {
      id: "iphone-11",
      name: "iPhone 11",
      shortName: "11",
      color: "Red",
      price: "₦235,000",
      condition: "Clean Used",
      badge: "Popular",
      description:
        "A balanced everyday iPhone with excellent cameras, dependable performance, and modern design.",
      image: "assets/11_front.jpg",
      backImage: "assets/11_back.jpg",
      specs: {
        Storage: "64GB",
        "Battery Health": "To be confirmed",
        FaceID: "To be confirmed",
        "Network": "Factory Unlocked",
        Condition: "Clean Used",
      },
    },
    {
      id: "iphone-12",
      name: "iPhone 12",
      shortName: "12",
      color: "Black",
      price: "₦315,000",
      condition: "Clean Used",
      badge: "Featured",
      description:
        "A refined, modern iPhone with an OLED display, 5G connectivity, and a sharp squared-edge design.",
      image: "assets/12_front.jpg",
      backImage: "assets/12_back.jpg",
      specs: {
        Storage: "64GB",
        "Battery Health": "To be confirmed",
        FaceID: "To be confirmed",
        "Network": "Factory Unlocked",
        Condition: "Clean Used",
      },
    },
  ];

  /* HELPERS */

  const select = (selector, parent = document) =>
    parent.querySelector(selector);

  const selectAll = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const createWhatsAppLink = (message) =>
    `${whatsappBase}?text=${encodeURIComponent(message)}`;

  /* RENDER INVENTORY */

  const inventorySlider = select("#inventorySlider");

  function renderInventory() {
    if (!inventorySlider) return;

    inventorySlider.innerHTML = inventory
      .map(
        (product, index) => `
          <article class="product-card reveal" data-product-id="${product.id}">
            <div class="product-image-wrap">
              <img
                src="${product.image}"
                data-front="${product.image}"
                data-back="${product.backImage}"
                alt="${product.name} ${product.color}"
                loading="${index === 0 ? "eager" : "lazy"}"
              />

              <span class="product-badge">${product.badge}</span>

              <button
                class="product-image-toggle"
                type="button"
                aria-label="Switch product image"
                data-image-toggle
              >
                ↻
              </button>

              <div class="product-dots">
                <span class="product-dot active"></span>
                <span class="product-dot"></span>
              </div>
            </div>

            <div class="product-info">
              <div class="product-meta">
                <span>${product.color}</span>
                <strong>${product.price}</strong>
              </div>

              <h3>${product.name}</h3>

              <p>${product.description}</p>

              <div class="product-bottom">
                <span class="product-condition">
                  ${product.condition}
                </span>

                <button
                  class="product-view"
                  type="button"
                  data-product-view="${product.id}"
                >
                  View details <span>↗</span>
                </button>
              </div>
            </div>
          </article>
        `
      )
      .join("");

    attachProductEvents();
    initializeRevealObserver();
  }

  /* IMAGE SWITCHING */

  function attachProductEvents() {
    selectAll("[data-image-toggle]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();

        const card = button.closest(".product-card");
        const image = select("img", card);
        const dots = selectAll(".product-dot", card);

        const showingFront = image.src.includes(image.dataset.front);

        image.style.opacity = "0";

        setTimeout(() => {
          image.src = showingFront
            ? image.dataset.back
            : image.dataset.front;

          image.style.opacity = "1";

          dots.forEach((dot, index) => {
            dot.classList.toggle(
              "active",
              showingFront ? index === 1 : index === 0
            );
          });
        }, 180);
      });
    });

    selectAll("[data-product-view]").forEach((button) => {
      button.addEventListener("click", () => {
        const product = inventory.find(
          (item) => item.id === button.dataset.productView
        );

        if (product) openProductModal(product);
      });
    });
  }

  /* INVENTORY DRAGGING */

  let isDragging = false;
  let dragStartX = 0;
  let dragScrollLeft = 0;

  if (inventorySlider) {
    inventorySlider.addEventListener("mousedown", (event) => {
      isDragging = true;
      inventorySlider.classList.add("dragging");
      dragStartX = event.pageX - inventorySlider.offsetLeft;
      dragScrollLeft = inventorySlider.scrollLeft;
    });

    inventorySlider.addEventListener("mouseleave", () => {
      isDragging = false;
      inventorySlider.classList.remove("dragging");
    });

    inventorySlider.addEventListener("mouseup", () => {
      isDragging = false;
      inventorySlider.classList.remove("dragging");
    });

    inventorySlider.addEventListener("mousemove", (event) => {
      if (!isDragging) return;

      event.preventDefault();

      const currentX = event.pageX - inventorySlider.offsetLeft;
      const distance = (currentX - dragStartX) * 1.4;

      inventorySlider.scrollLeft = dragScrollLeft - distance;
    });

    let touchStartX = 0;
    let touchScrollLeft = 0;

    inventorySlider.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.touches[0].pageX;
        touchScrollLeft = inventorySlider.scrollLeft;
      },
      { passive: true }
    );

    inventorySlider.addEventListener(
      "touchmove",
      (event) => {
        const currentX = event.touches[0].pageX;
        const distance = (currentX - touchStartX) * 1.2;

        inventorySlider.scrollLeft = touchScrollLeft - distance;
      },
      { passive: true }
    );
  }

  /* INVENTORY CONTROLS */

  const previousButton = select(".inventory-prev");
  const nextButton = select(".inventory-next");

  function moveInventory(direction) {
    if (!inventorySlider) return;

    const amount = inventorySlider.clientWidth * 0.78;

    inventorySlider.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });
  }

  previousButton?.addEventListener("click", () => moveInventory(-1));
  nextButton?.addEventListener("click", () => moveInventory(1));

  /* PRODUCT MODAL */

  const productModal = select("#productModal");
  const modalImage = select("#modalProductImage");
  const modalName = select("#modalProductName");
  const modalDescription = select("#modalProductDescription");
  const modalSpecs = select("#modalProductSpecs");
  const modalWhatsApp = select("#modalWhatsApp");
  const modalClose = select(".modal-close");
  const modalOverlay = select(".modal-overlay");

  function openProductModal(product) {
    if (!productModal) return;

    modalImage.src = product.image;
    modalImage.alt = product.name;

    modalName.textContent = product.name;
    modalDescription.textContent = product.description;

    modalSpecs.innerHTML = Object.entries(product.specs)
      .map(
        ([key, value]) => `
          <div class="modal-spec">
            <span>${key}</span>
            <strong>${value}</strong>
          </div>
        `
      )
      .join("");

    modalWhatsApp.href = createWhatsAppLink(
      `Hello Fixit Sxpect, I'm interested in the ${product.name}. Please share the current availability, condition, battery health, and final price.`
    );

    productModal.classList.add("active");
    document.body.classList.add("menu-open");
  }

  function closeProductModal() {
    productModal?.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  modalClose?.addEventListener("click", closeProductModal);
  modalOverlay?.addEventListener("click", closeProductModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProductModal();
  });

  /* MOBILE MENU */

  const menuToggle = select(".menu-toggle");
  const mainNav = select(".main-nav");

  menuToggle?.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("active");

    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  selectAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav?.classList.remove("active");
      menuToggle?.classList.remove("active");
      menuToggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });

  /* WHATSAPP LINKS */

  function initializeWhatsAppLinks() {
    selectAll("[data-whatsapp]").forEach((link) => {
      const message =
        link.dataset.whatsapp ||
        "Hello Fixit Sxpect, I would like to make an inquiry.";

      link.href = createWhatsAppLink(message);
      link.target = "_blank";
      link.rel = "noopener";
    });

    selectAll('a[href*="wa.me"]').forEach((link) => {
      link.target = "_blank";
      link.rel = "noopener";
    });
  }

  /* HEADER SCROLL */

  const header = select(".site-header");

  function handleHeaderScroll() {
    header?.classList.toggle("scrolled", window.scrollY > 30);
  }

  window.addEventListener("scroll", handleHeaderScroll, {
    passive: true,
  });

  handleHeaderScroll();

  /* REVEAL OBSERVER */

  let revealObserver;

  function initializeRevealObserver() {
    const revealElements = selectAll(".reveal:not(.visible)");

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) =>
        element.classList.add("visible")
      );
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
        }
      );
    }

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  /* IMAGE FALLBACK */

  document.addEventListener(
    "error",
    (event) => {
      const image = event.target;

      if (image.tagName !== "IMG") return;

      image.style.objectFit = "contain";
      image.style.padding = "30px";
      image.style.opacity = "0.45";
    },
    true
  );

  /* INITIALIZE */

  renderInventory();
  initializeWhatsAppLinks();
  initializeRevealObserver();

  /* ACTIVE NAVIGATION */

  const sections = selectAll("section[id]");
  const navLinks = selectAll('.main-nav a[href^="#"]');

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 180;

    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = section.id;
      }
    });

    navLinks.forEach((link) => {
      const target = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active", target === currentSection);
    });
  }

  window.addEventListener("scroll", updateActiveNav, {
    passive: true,
  });

  updateActiveNav();

  /* SMOOTH ANCHOR FALLBACK */

  selectAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = select(targetId);

      if (!targetElement) return;

      event.preventDefault();

      const headerOffset = 85;
      const targetPosition =
        targetElement.getBoundingClientRect().top +
        window.scrollY -
        headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });

  /* BUTTON PRESS EFFECT */

  selectAll(".btn, .inventory-control, .contact-action").forEach(
    (button) => {
      button.addEventListener("mousedown", () => {
        button.style.transform = "scale(0.97)";
      });

      button.addEventListener("mouseup", () => {
        button.style.transform = "";
      });

      button.addEventListener("mouseleave", () => {
        button.style.transform = "";
      });
    }
  );

  /* HERO PHONE PARALLAX */

  const heroVisual = select(".hero-visual");
  const heroPhoneCard = select(".hero-phone-card");

  if (
    heroVisual &&
    heroPhoneCard &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    heroVisual.addEventListener("mousemove", (event) => {
      const rect = heroVisual.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      heroPhoneCard.style.transform = `
        rotate(${7 + x * 5}deg)
        translate(${x * 10}px, ${y * -10}px)
      `;
    });

    heroVisual.addEventListener("mouseleave", () => {
      heroPhoneCard.style.transform = "rotate(7deg)";
    });
  }

  /* CONTACT ACTIONS */

  selectAll("[data-contact-message]").forEach((element) => {
    element.addEventListener("click", () => {
      const message =
        element.dataset.contactMessage ||
        "Hello Fixit Sxpect, I would like to make an inquiry.";

      window.open(
        createWhatsAppLink(message),
        "_blank",
        "noopener,noreferrer"
      );
    });
  });

  /* CURRENT YEAR */

  const yearElement = select("[data-current-year]");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* IMAGE LOADING ENHANCEMENT */

  selectAll("img").forEach((image) => {
    image.addEventListener("load", () => {
      image.classList.add("loaded");
    });
  });

  /* PAGE LOADED STATE */

  window.addEventListener("load", () => {
    document.body.classList.add("page-loaded");
  });

})();
