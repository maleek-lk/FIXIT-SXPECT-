/* =========================================================
   FIXIT SXPECT
   Main Website JavaScript
========================================================= */

(() => {
  "use strict";

  /* =========================================================
     CONFIG
  ========================================================= */

  const WHATSAPP_NUMBER = "2347087554590";

  const whatsappLink = (message = "") => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  };

  /*
    Update only the image paths here if your filenames differ.
  */

  const inventory = [
    {
      id: "iphone-7-plus",
      name: "iPhone 7 Plus",
      color: "Product Red",
      tag: "Classic Flagship",
      condition: "Clean Used",
      battery: "Battery health available on request",
      faceId: "Touch ID",
      parts: "Parts status confirmed before purchase",
      network: "Network availability confirmed",
      price: "Ask for current price",
      description:
        "A bold red iPhone 7 Plus with a white front and classic black home button. Ideal for buyers who want a reliable large-screen iPhone at an accessible price.",
      images: [
        "assets/7plus_front.jpg",
        "assets/7plus_back.jpg"
      ]
    },

    {
      id: "iphone-8-plus",
      name: "iPhone 8 Plus",
      color: "Gold / Ivory",
      tag: "Elegant Classic",
      condition: "Clean Used",
      battery: "Battery health available on request",
      faceId: "Touch ID",
      parts: "Parts status confirmed before purchase",
      network: "Network availability confirmed",
      price: "Ask for current price",
      description:
        "A refined iPhone 8 Plus with a warm gold finish and white front. A balanced choice for buyers who prefer the classic iPhone design with strong everyday performance.",
      images: [
        "assets/8plus_front.jpg",
        "assets/8plus_back.jpg"
      ]
    },

    {
      id: "iphone-11",
      name: "iPhone 11",
      color: "Product Red",
      tag: "Everyday Power",
      condition: "Clean Used",
      battery: "Battery health available on request",
      faceId: "Face ID",
      parts: "Parts status confirmed before purchase",
      network: "Network availability confirmed",
      price: "Ask for current price",
      description:
        "A striking red iPhone 11 built for everyday performance, strong cameras, Face ID convenience, and a modern all-screen experience.",
      images: [
        "assets/11_front.jpg",
        "assets/11_back.jpg"
      ]
    },

    {
      id: "iphone-12",
      name: "iPhone 12",
      color: "Black",
      tag: "Modern Essential",
      condition: "Clean Used",
      battery: "Battery health available on request",
      faceId: "Face ID",
      parts: "Parts status confirmed before purchase",
      network: "Network availability confirmed",
      price: "Ask for current price",
      description:
        "A sleek black iPhone 12 with a modern flat-edge design. Designed for buyers who want a current-looking iPhone with dependable daily performance.",
      images: [
        "assets/12_front.jpg",
        "assets/12_back.jpg"
      ]
    }
  ];

  /* =========================================================
     DOM HELPERS
  ========================================================= */

  const select = (selector, parent = document) =>
    parent.querySelector(selector);

  const selectAll = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const createElement = (tag, className = "", html = "") => {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (html) {
      element.innerHTML = html;
    }

    return element;
  };

  /* =========================================================
     INVENTORY RENDERING
  ========================================================= */

  const inventorySlider = select("#inventorySlider");

  function renderInventory() {
    if (!inventorySlider) return;

    inventorySlider.innerHTML = "";

    inventory.forEach((product, index) => {
      const card = createElement("article", "inventory-card");

      if (index === 0) {
        card.classList.add("inventory-card-featured");
      }

      card.dataset.productId = product.id;

      card.innerHTML = `
        <div class="inventory-card-image">
          <img
            src="${product.images[0]}"
            alt="${product.name} in ${product.color}"
            loading="lazy"
            data-image-index="0"
          />

          <span class="inventory-card-index">
            0${index + 1}
          </span>

          <span class="inventory-card-tag">
            ${product.tag}
          </span>

          <span class="inventory-image-count">
            01 / ${String(product.images.length).padStart(2, "0")}
          </span>

          <div class="inventory-card-gallery">
            ${product.images
              .map(
                (_, imageIndex) => `
                  <button
                    class="inventory-dot ${
                      imageIndex === 0 ? "active" : ""
                    }"
                    type="button"
                    aria-label="View image ${imageIndex + 1} of ${
                      product.name
                    }"
                    data-product-id="${product.id}"
                    data-image-index="${imageIndex}"
                  ></button>
                `
              )
              .join("")}
          </div>
        </div>

        <div class="inventory-card-content">
          <div class="inventory-card-meta">
            <span>${product.color}</span>
            <span>${product.condition}</span>
          </div>

          <h3>${product.name}</h3>

          <p>
            ${product.description}
          </p>

          <div class="inventory-card-specs">
            <span>${product.faceId}</span>
            <span>${product.network}</span>
          </div>

          <div class="inventory-card-footer">
            <div>
              <small>Availability</small>
              <strong>${product.price}</strong>
            </div>

            <button
              class="card-link product-view-button"
              type="button"
              data-product-id="${product.id}"
            >
              View details
              <span>↗</span>
            </button>
          </div>
        </div>
      `;

      inventorySlider.appendChild(card);
    });

    bindInventoryEvents();
  }

  function bindInventoryEvents() {
    selectAll(".inventory-dot").forEach((dot) => {
      dot.addEventListener("click", (event) => {
        event.stopPropagation();

        const productId = dot.dataset.productId;
        const imageIndex = Number(dot.dataset.imageIndex);

        changeProductImage(productId, imageIndex);
      });
    });

    selectAll(".product-view-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();

        const product = inventory.find(
          (item) => item.id === button.dataset.productId
        );

        if (product) {
          openProductModal(product);
        }
      });
    });

    selectAll(".inventory-card").forEach((card) => {
      card.addEventListener("click", () => {
        const product = inventory.find(
          (item) => item.id === card.dataset.productId
        );

        if (product) {
          openProductModal(product);
        }
      });
    });
  }

  function changeProductImage(productId, imageIndex) {
    const product = inventory.find((item) => item.id === productId);
    const card = select(
      `.inventory-card[data-product-id="${productId}"]`
    );

    if (!product || !card) return;

    const image = select("img", card);
    const dots = selectAll(".inventory-dot", card);
    const imageCount = select(".inventory-image-count", card);

    if (!image || !product.images[imageIndex]) return;

    image.style.opacity = "0";

    setTimeout(() => {
      image.src = product.images[imageIndex];
      image.alt = `${product.name}, image ${imageIndex + 1}`;
      image.dataset.imageIndex = imageIndex;
      image.style.opacity = "1";
    }, 150);

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === imageIndex);
    });

    if (imageCount) {
      imageCount.textContent = `${String(imageIndex + 1).padStart(
        2,
        "0"
      )} / ${String(product.images.length).padStart(2, "0")}`;
    }
  }

  /* =========================================================
     INVENTORY SLIDER CONTROLS
  ========================================================= */

  const previousButton = select(".inventory-prev");
  const nextButton = select(".inventory-next");

  function scrollInventory(direction) {
    if (!inventorySlider) return;

    const card = select(".inventory-card", inventorySlider);

    if (!card) return;

    const cardWidth = card.getBoundingClientRect().width;
    const gap = 24;

    inventorySlider.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth"
    });
  }

  previousButton?.addEventListener("click", () => {
    scrollInventory(-1);
  });

  nextButton?.addEventListener("click", () => {
    scrollInventory(1);
  });

  /* =========================================================
     DRAG / SWIPE INVENTORY
  ========================================================= */

  let isDragging = false;
  let dragStartX = 0;
  let dragScrollLeft = 0;

  inventorySlider?.addEventListener("pointerdown", (event) => {
    isDragging = true;
    dragStartX = event.pageX;
    dragScrollLeft = inventorySlider.scrollLeft;

    inventorySlider.classList.add("is-dragging");
    inventorySlider.setPointerCapture(event.pointerId);
  });

  inventorySlider?.addEventListener("pointermove", (event) => {
    if (!isDragging) return;

    const distance = event.pageX - dragStartX;

    inventorySlider.scrollLeft = dragScrollLeft - distance;
  });

  const stopDragging = () => {
    isDragging = false;
    inventorySlider?.classList.remove("is-dragging");
  };

  inventorySlider?.addEventListener("pointerup", stopDragging);
  inventorySlider?.addEventListener("pointercancel", stopDragging);
  inventorySlider?.addEventListener("pointerleave", stopDragging);

  /* =========================================================
     PRODUCT MODAL
  ========================================================= */

  const productModal = select("#productModal");
  const modalClose = select(".product-modal-close");
  const modalImage = select("#modalProductImage");
  const modalName = select("#modalProductName");
  const modalDescription = select("#modalProductDescription");
  const modalSpecs = select("#modalProductSpecs");
  const modalWhatsApp = select("#modalWhatsApp");

  let activeProduct = null;

  function openProductModal(product) {
    if (!productModal) return;

    activeProduct = product;

    if (modalImage) {
      modalImage.src = product.images[0];
      modalImage.alt = product.name;
    }

    if (modalName) {
      modalName.textContent = product.name;
    }

    if (modalDescription) {
      modalDescription.textContent = product.description;
    }

    if (modalSpecs) {
      modalSpecs.innerHTML = `
        <li>
          <span>Finish</span>
          <strong>${product.color}</strong>
        </li>

        <li>
          <span>Condition</span>
          <strong>${product.condition}</strong>
        </li>

        <li>
          <span>Biometric</span>
          <strong>${product.faceId}</strong>
        </li>

        <li>
          <span>Battery</span>
          <strong>${product.battery}</strong>
        </li>

        <li>
          <span>Parts status</span>
          <strong>${product.parts}</strong>
        </li>

        <li>
          <span>Network</span>
          <strong>${product.network}</strong>
        </li>
      `;
    }

    if (modalWhatsApp) {
      modalWhatsApp.href = whatsappLink(
        `Hello Fixit Sxpect, I am interested in the ${product.name}. Please share the current price, availability, battery health, and full condition details.`
      );
    }

    productModal.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }

  function closeProductModal() {
    if (!productModal) return;

    productModal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    activeProduct = null;
  }

  modalClose?.addEventListener("click", closeProductModal);

  productModal?.addEventListener("click", (event) => {
    if (event.target === productModal) {
      closeProductModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProductModal();
    }
  });

  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const menuToggle = select(".menu-toggle");
  const mobileMenu = select(".mobile-menu");

  function closeMobileMenu() {
    menuToggle?.classList.remove("active");
    mobileMenu?.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = mobileMenu?.classList.toggle("is-open");

    menuToggle.classList.toggle("active", isOpen);
    document.body.classList.toggle("no-scroll", isOpen);
  });

  selectAll(".mobile-menu a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("click", (event) => {
    if (
      mobileMenu?.classList.contains("is-open") &&
      !mobileMenu.contains(event.target) &&
      !menuToggle?.contains(event.target)
    ) {
      closeMobileMenu();
    }
  });

  /* =========================================================
     WHATSAPP LINKS
  ========================================================= */

  selectAll("[data-whatsapp]").forEach((element) => {
    const message =
      element.dataset.whatsapp ||
      "Hello Fixit Sxpect, I would like to make an inquiry.";

    element.href = whatsappLink(message);
  });

  /* =========================================================
     HEADER SCROLL STATE
  ========================================================= */

  const header = select(".site-header");

  function updateHeader() {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 30);
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();

  /* =========================================================
     REVEAL ON SCROLL
  ========================================================= */

  const revealElements = selectAll(
    ".service-card, .intro-copy, .intro-visual, .waybill-copy, .waybill-visual, .repair-panel, .contact-panel, .inventory-card"
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* =========================================================
     IMAGE FALLBACK
  ========================================================= */

  document.addEventListener(
    "error",
    (event) => {
      const target = event.target;

      if (target.tagName !== "IMG") return;

      target.classList.add("image-error");

      if (!target.dataset.fallbackApplied) {
        target.dataset.fallbackApplied = "true";
        target.style.visibility = "hidden";
      }
    },
    true
  );

  /* =========================================================
     INITIALIZE
  ========================================================= */

  renderInventory();

    /* =========================================================
     ACTIVE NAVIGATION
  ========================================================= */

  const navigationLinks = selectAll(
    '.desktop-nav a[href^="#"], .mobile-menu a[href^="#"]'
  );

  const pageSections = selectAll("main section[id]");

  function updateActiveNavigation() {
    const currentPosition = window.scrollY + 180;

    let currentSection = "";

    pageSections.forEach((section) => {
      if (currentPosition >= section.offsetTop) {
        currentSection = section.id;
      }
    });

    navigationLinks.forEach((link) => {
      const targetId = link.getAttribute("href")?.replace("#", "");

      link.classList.toggle(
        "active",
        targetId === currentSection
      );
    });
  }

  window.addEventListener("scroll", updateActiveNavigation, {
    passive: true
  });

  updateActiveNavigation();

  /* =========================================================
     SMOOTH ANCHOR SCROLLING
  ========================================================= */

  selectAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = select(targetId);

      if (!target) return;

      event.preventDefault();

      const headerOffset = 90;
      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });

  /* =========================================================
     HERO BUTTON MICRO INTERACTIONS
  ========================================================= */

  selectAll(".button, .slider-button, .round-arrow").forEach(
    (button) => {
      button.addEventListener("pointerdown", () => {
        button.classList.add("pressed");
      });

      button.addEventListener("pointerup", () => {
        button.classList.remove("pressed");
      });

      button.addEventListener("pointerleave", () => {
        button.classList.remove("pressed");
      });
    }
  );

  /* =========================================================
     PARALLAX EFFECT FOR HERO VISUAL
  ========================================================= */

  const heroVisual = select(".hero-visual");

  if (heroVisual && window.matchMedia("(pointer: fine)").matches) {
    heroVisual.addEventListener("mousemove", (event) => {
      const bounds = heroVisual.getBoundingClientRect();

      const x =
        (event.clientX - bounds.left) / bounds.width - 0.5;

      const y =
        (event.clientY - bounds.top) / bounds.height - 0.5;

      heroVisual.style.transform = `
        perspective(1000px)
        rotateY(${x * 4}deg)
        rotateX(${y * -4}deg)
      `;
    });

    heroVisual.addEventListener("mouseleave", () => {
      heroVisual.style.transform = "";
    });
  }

  /* =========================================================
     CONTACT FORM-LIKE ACTIONS
  ========================================================= */

  selectAll("[data-contact-message]").forEach((button) => {
    button.addEventListener("click", () => {
      const message =
        button.dataset.contactMessage ||
        "Hello Fixit Sxpect, I would like to make an inquiry.";

      window.open(
        whatsappLink(message),
        "_blank",
        "noopener,noreferrer"
      );
    });
  });

  /* =========================================================
     CURRENT YEAR
  ========================================================= */

  selectAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  /* =========================================================
     PREVENT IMAGE DRAGGING
  ========================================================= */

  selectAll("img").forEach((image) => {
    image.setAttribute("draggable", "false");
  });

  /* =========================================================
     PAGE LOADED STATE
  ========================================================= */

  window.addEventListener("load", () => {
    document.body.classList.add("page-loaded");
  });

  /* =========================================================
     ACTIVE NAVIGATION
  ========================================================= */

  const navigationLinks = selectAll(
    '.desktop-nav a[href^="#"], .mobile-menu a[href^="#"]'
  );

  const pageSections = selectAll("main section[id]");

  function updateActiveNavigation() {
    const currentPosition = window.scrollY + 180;
    let currentSection = "";

    pageSections.forEach((section) => {
      if (currentPosition >= section.offsetTop) {
        currentSection = section.id;
      }
    });

    navigationLinks.forEach((link) => {
      const targetId = link.getAttribute("href")?.replace("#", "");

      link.classList.toggle(
        "active",
        targetId === currentSection
      );
    });
  }

  window.addEventListener("scroll", updateActiveNavigation, {
    passive: true
  });

  updateActiveNavigation();

  /* =========================================================
     SMOOTH ANCHOR SCROLLING
  ========================================================= */

  selectAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = select(targetId);

      if (!target) return;

      event.preventDefault();

      const headerOffset = 90;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });

  /* =========================================================
     BUTTON PRESS EFFECT
  ========================================================= */

  selectAll(".button, .slider-button, .round-arrow").forEach(
    (button) => {
      button.addEventListener("pointerdown", () => {
        button.classList.add("pressed");
      });

      button.addEventListener("pointerup", () => {
        button.classList.remove("pressed");
      });

      button.addEventListener("pointerleave", () => {
        button.classList.remove("pressed");
      });
    }
  );

  /* =========================================================
     HERO PARALLAX
  ========================================================= */

  const heroVisual = select(".hero-visual");

  if (
    heroVisual &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    heroVisual.addEventListener("mousemove", (event) => {
      const bounds = heroVisual.getBoundingClientRect();

      const x =
        (event.clientX - bounds.left) / bounds.width - 0.5;

      const y =
        (event.clientY - bounds.top) / bounds.height - 0.5;

      heroVisual.style.transform = `
        perspective(1000px)
        rotateY(${x * 4}deg)
        rotateX(${y * -4}deg)
      `;
    });

    heroVisual.addEventListener("mouseleave", () => {
      heroVisual.style.transform = "";
    });
  }

  /* =========================================================
     CUSTOM WHATSAPP ACTIONS
  ========================================================= */

  selectAll("[data-contact-message]").forEach((button) => {
    button.addEventListener("click", () => {
      const message =
        button.dataset.contactMessage ||
        "Hello Fixit Sxpect, I would like to make an inquiry.";

      window.open(
        whatsappLink(message),
        "_blank",
        "noopener,noreferrer"
      );
    });
  });

  /* =========================================================
     CURRENT YEAR
  ========================================================= */

  selectAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  /* =========================================================
     IMAGE SETTINGS
  ========================================================= */

  selectAll("img").forEach((image) => {
    image.setAttribute("draggable", "false");
  });

  /* =========================================================
     PAGE LOADED
  ========================================================= */

  window.addEventListener("load", () => {
    document.body.classList.add("page-loaded");
  });

})();
  
})();
