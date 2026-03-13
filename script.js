const CATEGORY_FOLDERS = {
  nature: 'На природе',
  floor: 'На полу',
  friends: 'С друзьями',
  party: 'На вечеринке',
  closeup: 'Крупный план',
  couch: 'На диване',
  objects: 'Коллекция Павел и предметы',
};

const CATEGORY_FILES = {
  nature: [
    'photo_130@10-01-2025_12-08-49.jpg',
    'photo_147@14-01-2025_15-35-31.jpg',
    'photo_149@14-01-2025_15-35-31.jpg',
    'photo_28@04-01-2025_00-49-23.jpg',
    'photo_30@04-01-2025_00-49-23.jpg',
    'photo_94@07-01-2025_02-20-08.jpg',
  ],
  floor: [
    'photo_100@07-01-2025_02-30-01.jpg',
    'photo_109@07-01-2025_02-30-01.jpg',
    'photo_112@07-01-2025_02-30-02.jpg',
    'photo_141@14-01-2025_15-30-32.jpg',
  ],
  friends: [
    'photo_103@07-01-2025_02-30-01.jpg',
    'photo_106@07-01-2025_02-30-01.jpg',
    'photo_110@07-01-2025_02-30-02.jpg',
    'photo_127@07-01-2025_12-18-57.jpg',
    'photo_129@10-01-2025_12-08-49.jpg',
    'photo_132@10-01-2025_12-08-49.jpg',
    'photo_142@14-01-2025_15-30-32.jpg',
    'photo_148@14-01-2025_15-35-31.jpg',
    'photo_44@04-01-2025_02-01-49.jpg',
    'photo_48@04-01-2025_02-03-51.jpg',
    'photo_50@04-01-2025_02-04-27.jpg',
    'photo_68@06-01-2025_02-59-12.jpg',
    'photo_75@06-01-2025_15-23-06.jpg',
    'photo_76@06-01-2025_15-23-06.jpg',
    'photo_78@06-01-2025_15-23-06.jpg',
    'photo_91@07-01-2025_02-16-55.jpg',
  ],
  party: [
    'photo_121@07-01-2025_02-34-09.jpg',
    'photo_133@10-01-2025_12-08-49.jpg',
    'photo_42@04-01-2025_02-00-20.jpg',
    'photo_64@06-01-2025_00-43-09.jpg',
    'photo_72@06-01-2025_15-23-06.jpg',
    'photo_83@06-01-2025_15-40-43.jpg',
    'photo_84@06-01-2025_15-40-43.jpg',
    'photo_90@07-01-2025_02-15-06.jpg',
    'photo_93@07-01-2025_02-17-51.jpg',
  ],
  closeup: [
    'photo_105@07-01-2025_02-30-01.jpg',
    'photo_120@07-01-2025_02-33-22.jpg',
    'photo_125@07-01-2025_02-40-07.jpg',
    'photo_22@04-01-2025_00-36-57.jpg',
    'photo_26@04-01-2025_00-44-32.jpg',
    'photo_52@04-01-2025_02-05-04.jpg',
    'photo_65@06-01-2025_02-58-22.jpg',
    'photo_66@06-01-2025_02-58-33.jpg',
    'photo_67@06-01-2025_02-58-53.jpg',
  ],
  couch: [
    'photo_108@07-01-2025_02-30-01.jpg',
    'photo_145@14-01-2025_15-33-54.jpg',
    'photo_36@04-01-2025_01-50-50.jpg',
    'photo_40@04-01-2025_02-00-00.jpg',
    'photo_41@04-01-2025_02-00-11.jpg',
    'photo_45@04-01-2025_02-02-35.jpg',
    'photo_53@06-01-2025_00-08-12.jpg',
    'photo_80@06-01-2025_15-40-43.jpg',
    'photo_85@06-01-2025_15-40-43.jpg',
    'photo_86@06-01-2025_15-40-43.jpg',
    'photo_87@06-01-2025_15-40-43.jpg',
    'photo_89@07-01-2025_01-41-11.jpg',
    'photo_98@07-01-2025_02-23-48.jpg',
    'photo_99@07-01-2025_02-23-48.jpg',
  ],
  objects: [
    'photo_54@06-01-2025_00-35-13.jpg',
    'photo_55@06-01-2025_00-35-13.jpg',
    'photo_56@06-01-2025_00-35-13.jpg',
    'photo_57@06-01-2025_00-35-13.jpg',
    'photo_58@06-01-2025_00-35-13.jpg',
    'photo_59@06-01-2025_00-35-13.jpg',
    'photo_60@06-01-2025_00-35-13.jpg',
    'photo_61@06-01-2025_00-35-13.jpg',
    'photo_62@06-01-2025_00-35-13.jpg',
    'photo_63@06-01-2025_00-35-13.jpg',
  ],
};

const PHOTO_ITEMS = Object.entries(CATEGORY_FILES).flatMap(([category, files]) =>
  files.map((fileName, index) => ({
    id: `${category}-${index + 1}`,
    title: 'Фото',
    category,
    price: 10,
    url: encodeURI(`photos/${CATEGORY_FOLDERS[category]}/${fileName}`),
  }))
);

const WEBHOOK_ORDER_CONFIG = {
  webhookUrl: 'https://n8n.deryugin777.ru/webhook/photo-order',
  webhookSecret: 'whsec_83a2c18c7719671edb0cd08b2dfba88f8200d8683c76509f',
  githubOwner: 'deruginalex0-netizen',
  githubRepo: 'pashka_spit',
  // Используйте ссылку на бота без параметра start, order_id добавится автоматически.
  activationBotUrl: 'https://t.me/AAAAAAA_blya_bot',
};

const state = {
  activeCategory: 'all',
  cart: loadCart(),
  randomizedPhotos: shufflePhotos(PHOTO_ITEMS),
  filterTransitionId: 0,
  galleryTransitionAnim: null,
  isOrderSubmitting: false,
};

const elements = {
  categoriesNav: document.querySelector('.header__categories'),
  tabsIndicator: document.getElementById('tabs-indicator'),
  gallery: document.getElementById('gallery'),
  cartCount: document.getElementById('cart-count'),
  cartList: document.getElementById('cart-list'),
  cartTotal: document.getElementById('cart-total'),
  cartPanel: document.getElementById('cart-panel'),
  clearCart: document.getElementById('clear-cart'),
  checkoutButton: document.querySelector('.cart__checkout'),
  overlay: document.getElementById('overlay'),
  openCart: document.getElementById('open-cart'),
  closeCart: document.getElementById('close-cart'),
  orderModal: document.getElementById('order-modal'),
  closeOrderModal: document.getElementById('close-order-modal'),
  orderForm: document.getElementById('order-form'),
  orderFullName: document.getElementById('order-fullname'),
  orderEmail: document.getElementById('order-email'),
  orderTelegram: document.getElementById('order-telegram'),
  orderFormError: document.getElementById('order-form-error'),
  orderSubmit: document.getElementById('order-submit'),
  orderSuccessModal: document.getElementById('order-success-modal'),
  closeOrderSuccess: document.getElementById('close-order-success'),
  orderBotLink: document.getElementById('order-bot-link'),
  lightbox: document.getElementById('lightbox'),
  lightboxImage: document.getElementById('lightbox-image'),
  closeLightbox: document.getElementById('close-lightbox'),
};

export function init() {
  registerFlipPlugin();
  bindCategoryFilters();
  initSlideTabs();
  bindCartControls();
  bindCheckoutControls();
  bindLightboxControls();
  applyOrderBotLink();
  renderGallery();
  applyFilterWithFlip(false);
  renderCart();
}

function registerFlipPlugin() {
  if (window.gsap && window.Flip) {
    window.gsap.registerPlugin(window.Flip);
  }
}

function bindCategoryFilters() {
  document.querySelectorAll('[data-category-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeCategory = button.dataset.categoryFilter;

      document.querySelectorAll('[data-category-filter]').forEach((el) => {
        el.classList.toggle('is-active', el === button);
      });

      moveSlideTabIndicator(button, true);
      applyFilterWithFlip(true, true);
    });
  });
}

function initSlideTabs() {
  const activeButton = document.querySelector('[data-category-filter].is-active');
  if (activeButton) {
    moveSlideTabIndicator(activeButton, false);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const currentActive = document.querySelector('[data-category-filter].is-active');
      if (currentActive) {
        moveSlideTabIndicator(currentActive, false);
      }
    }, 100);
  });
}

function moveSlideTabIndicator(button, animate) {
  if (!elements.tabsIndicator || !elements.categoriesNav || !button) return;

  const indicator = elements.tabsIndicator;
  const targetX = button.offsetLeft;
  const targetWidth = button.offsetWidth;

  if (!animate) {
    indicator.style.transition = 'none';
  }

  indicator.style.width = `${targetWidth}px`;
  indicator.style.transform = `translateX(${targetX}px)`;
  indicator.classList.add('is-ready');

  if (!animate) {
    requestAnimationFrame(() => {
      indicator.style.transition = '';
    });
  }
}

function bindCartControls() {
  elements.openCart.addEventListener('click', openCart);
  elements.closeCart.addEventListener('click', closeCart);
  elements.overlay.addEventListener('click', closeCart);
  elements.clearCart.addEventListener('click', clearCart);
}

function bindCheckoutControls() {
  elements.checkoutButton.addEventListener('click', () => {
    if (state.cart.length === 0) {
      window.alert('Корзина пустая. Добавьте фото перед оформлением.');
      return;
    }

    setOrderFormError('');
    openOrderModal();
  });

  elements.closeOrderModal.addEventListener('click', closeOrderModal);
  elements.orderModal.addEventListener('click', (event) => {
    if (event.target === elements.orderModal) {
      closeOrderModal();
    }
  });

  elements.closeOrderSuccess.addEventListener('click', closeOrderSuccessModal);
  elements.orderSuccessModal.addEventListener('click', (event) => {
    if (event.target === elements.orderSuccessModal) {
      closeOrderSuccessModal();
    }
  });

  elements.orderForm.addEventListener('submit', handleOrderSubmit);
}

function bindLightboxControls() {
  elements.closeLightbox.addEventListener('click', closeLightboxPreview);
  elements.lightbox.addEventListener('click', (event) => {
    if (event.target === elements.lightbox) {
      closeLightboxPreview();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeLightboxPreview();
    closeCart();
    closeOrderModal();
    closeOrderSuccessModal();
  });
}

function applyOrderBotLink() {
  setOrderBotLink();
}

function renderGallery() {
  const items = state.randomizedPhotos;

  elements.gallery.innerHTML = items
    .map(
      (item) => `
      <article
        class="gallery-item"
        data-flip="${item.category}"
      >
        <button class="gallery-item__button" data-preview-id="${item.id}" aria-label="Увеличить фото">
          <img src="${item.url}" alt="${item.title}" loading="lazy" />
        </button>
        <div class="gallery-item__cart-controls">
          <button
            class="gallery-item__cart gallery-item__cart--decrease"
            data-decrease-cart="${item.id}"
            type="button"
            aria-label="Уменьшить количество"
          >
            −
          </button>
          <button class="gallery-item__cart" data-add-cart="${item.id}" type="button">
            В корзину
          </button>
        </div>
      </article>
    `
    )
    .join('');

  elements.gallery.querySelectorAll('[data-preview-id]').forEach((button) => {
    button.addEventListener('click', () => {
      openLightboxPreview(button.dataset.previewId);
    });
  });

  elements.gallery.querySelectorAll('[data-add-cart]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      addToCart(button.dataset.addCart);
    });
  });

  elements.gallery.querySelectorAll('[data-decrease-cart]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      decrementFromCart(button.dataset.decreaseCart);
    });
  });

  updateGalleryCartButtons();
}

function applyFilterWithFlip(animate, reshuffle = false) {
  const shouldShow = (key) =>
    Boolean(key) && (state.activeCategory === 'all' || key === state.activeCategory);

  if (!animate) {
    cancelGalleryTransition();
    if (reshuffle) {
      state.randomizedPhotos = shufflePhotos(PHOTO_ITEMS);
      renderGallery();
    }
    applyCategoryVisibility(getGalleryItems(), shouldShow);
    return;
  }

  state.filterTransitionId += 1;
  const transitionId = state.filterTransitionId;
  cancelGalleryTransition();

  const fadeOut = elements.gallery.animate(
    [
      { opacity: 1, transform: 'translateY(0) scale(1)' },
      { opacity: 0, transform: 'translateY(-2px) scale(0.999)' },
    ],
    {
      duration: 260,
      easing: 'cubic-bezier(0.45, 0.03, 0.55, 0.95)',
      fill: 'forwards',
    }
  );

  state.galleryTransitionAnim = fadeOut;

  fadeOut.onfinish = () => {
    if (transitionId !== state.filterTransitionId) return;

    if (reshuffle) {
      state.randomizedPhotos = shufflePhotos(PHOTO_ITEMS);
      renderGallery();
    }
    applyCategoryVisibility(getGalleryItems(), shouldShow);

    requestAnimationFrame(() => {
      if (transitionId !== state.filterTransitionId) return;

      const fadeIn = elements.gallery.animate(
        [
          { opacity: 0, transform: 'translateY(2px) scale(0.999)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ],
        {
          duration: 520,
          easing: 'cubic-bezier(0.16, 0.84, 0.28, 1)',
          fill: 'forwards',
        }
      );

      state.galleryTransitionAnim = fadeIn;

      fadeIn.onfinish = () => {
        if (state.galleryTransitionAnim === fadeIn) {
          state.galleryTransitionAnim = null;
        }
        clearGalleryAnimatedStyles();
      };
    });
  };
}

function applyCategoryVisibility(items, shouldShow) {
  items.forEach((item) => {
    const key = item.getAttribute('data-flip');
    item.classList.toggle('is-hide', !shouldShow(key));
    item.classList.toggle('is-show', shouldShow(key));
  });
}

function getGalleryItems() {
  return Array.from(elements.gallery.querySelectorAll('[data-flip]'));
}

function cancelGalleryTransition() {
  if (state.galleryTransitionAnim) {
    state.galleryTransitionAnim.cancel();
    state.galleryTransitionAnim = null;
  }
  clearGalleryAnimatedStyles();
}

function clearGalleryAnimatedStyles() {
  elements.gallery.style.opacity = '';
  elements.gallery.style.transform = '';
}

function openLightboxPreview(photoId) {
  const item = PHOTO_ITEMS.find((photo) => photo.id === photoId);
  if (!item) return;

  elements.lightboxImage.src = item.url;
  elements.lightboxImage.alt = 'Фото';
  elements.lightbox.classList.add('is-open');
  elements.lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightboxPreview() {
  elements.lightbox.classList.remove('is-open');
  elements.lightbox.setAttribute('aria-hidden', 'true');
  elements.lightboxImage.src = '';
  document.body.style.overflow = '';
}

function addToCart(photoId) {
  const existing = state.cart.find((item) => item.photoId === photoId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ photoId, qty: 1 });
  }

  persistCart();
  renderCart();
}

function clearCart() {
  state.cart = [];
  persistCart();
  renderCart();
}

function decrementFromCart(photoId) {
  const item = state.cart.find((entry) => entry.photoId === photoId);
  if (!item) return;

  if (item.qty > 1) {
    item.qty -= 1;
  } else {
    state.cart = state.cart.filter((entry) => entry.photoId !== photoId);
  }

  persistCart();
  renderCart();
}

function getCartQty(photoId) {
  const item = state.cart.find((entry) => entry.photoId === photoId);
  return item ? item.qty : 0;
}

function getCartViewItems() {
  return state.cart
    .map((entry) => {
      const photo = PHOTO_ITEMS.find((item) => item.id === entry.photoId);
      if (!photo) return null;

      return {
        ...entry,
        photo,
        subtotal: photo.price * entry.qty,
      };
    })
    .filter(Boolean);
}

function updateGalleryCartButtons() {
  elements.gallery.querySelectorAll('.gallery-item__cart-controls').forEach((controls) => {
    const button = controls.querySelector('[data-add-cart]');
    const decreaseButton = controls.querySelector('[data-decrease-cart]');
    if (!button || !decreaseButton) return;

    const qty = getCartQty(button.dataset.addCart);
    if (qty > 0) {
      button.textContent = String(qty);
      button.classList.add('is-in-cart');
      button.setAttribute('aria-label', `В корзине: ${qty}`);
      decreaseButton.classList.add('is-visible');
      return;
    }

    button.textContent = 'В корзину';
    button.classList.remove('is-in-cart');
    button.setAttribute('aria-label', 'Добавить в корзину');
    decreaseButton.classList.remove('is-visible');
  });
}

function renderCart() {
  const viewItems = getCartViewItems();
  const totalCount = viewItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = viewItems.reduce((sum, item) => sum + item.subtotal, 0);

  elements.cartCount.textContent = String(totalCount);
  elements.cartTotal.textContent = formatRub(totalPrice);
  updateGalleryCartButtons();

  if (viewItems.length === 0) {
    elements.cartList.classList.add('is-empty');
    elements.cartList.innerHTML = '<li class="cart-empty">ПУСТО</li>';
    return;
  }

  elements.cartList.classList.remove('is-empty');
  elements.cartList.innerHTML = viewItems
    .map(
      (item) => `
      <li class="cart-item">
        <button class="cart-item__preview" data-cart-preview-id="${item.photo.id}" aria-label="Открыть фото">
          <img src="${item.photo.url}" alt="Фото" />
        </button>
        <div>
          <p class="cart-item__title">Фото</p>
          <p class="cart-item__price">${item.qty} × ${formatRub(item.photo.price)}</p>
        </div>
        <div class="cart-item__actions">
          <div class="cart-item__qty-controls">
            <button class="cart-item__step" data-decrement-cart="${item.photo.id}" aria-label="Уменьшить количество">−</button>
            <span class="cart-item__qty">${item.qty}</span>
            <button class="cart-item__step" data-increment-cart="${item.photo.id}" aria-label="Увеличить количество">+</button>
          </div>
        </div>
      </li>
    `
    )
    .join('');

  elements.cartList.querySelectorAll('[data-decrement-cart]').forEach((button) => {
    button.addEventListener('click', () => {
      decrementFromCart(button.dataset.decrementCart);
    });
  });

  elements.cartList.querySelectorAll('[data-increment-cart]').forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.incrementCart);
    });
  });

  elements.cartList.querySelectorAll('[data-cart-preview-id]').forEach((button) => {
    button.addEventListener('click', () => {
      openLightboxPreview(button.dataset.cartPreviewId);
    });
  });
}

function openCart() {
  elements.cartPanel.classList.add('is-open');
  elements.overlay.classList.add('is-visible');
}

function closeCart() {
  elements.cartPanel.classList.remove('is-open');
  elements.overlay.classList.remove('is-visible');
}

function openOrderModal() {
  closeCart();
  prefillOrderFormFromAuth();
  elements.orderModal.classList.add('is-open');
  elements.orderModal.setAttribute('aria-hidden', 'false');
  elements.orderFullName.focus();
}

function prefillOrderFormFromAuth() {
  const auth = window.__auth;
  if (!auth) return;

  const user = auth.getCurrentUser();
  const profile = auth.getCurrentProfile();
  if (!user) return;

  if (profile?.full_name && !elements.orderFullName.value) {
    elements.orderFullName.value = profile.full_name;
  }
  if (user.email && !elements.orderEmail.value) {
    elements.orderEmail.value = user.email;
  }
  if (profile?.telegram_username && !elements.orderTelegram.value) {
    elements.orderTelegram.value = '@' + profile.telegram_username;
  }
}

function closeOrderModal() {
  elements.orderModal.classList.remove('is-open');
  elements.orderModal.setAttribute('aria-hidden', 'true');
  setOrderFormError('');
}

function openOrderSuccessModal() {
  elements.orderSuccessModal.classList.add('is-open');
  elements.orderSuccessModal.setAttribute('aria-hidden', 'false');
}

function closeOrderSuccessModal() {
  elements.orderSuccessModal.classList.remove('is-open');
  elements.orderSuccessModal.setAttribute('aria-hidden', 'true');
}

function setOrderFormError(message) {
  elements.orderFormError.textContent = message;
}

function setOrderSubmitState(isSubmitting) {
  state.isOrderSubmitting = isSubmitting;
  elements.orderSubmit.disabled = isSubmitting;
  elements.orderSubmit.textContent = isSubmitting ? 'Отправляем...' : 'Отправить заказ';
}

function validateOrderFields({ fullName, email, telegram }) {
  if (fullName.length < 5) {
    return 'Укажите корректные ФИО.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailPattern.test(email)) {
    return 'Укажите корректную почту.';
  }

  const telegramUsernamePattern = /^@?[a-zA-Z0-9_]{5,32}$/;
  if (!telegramUsernamePattern.test(telegram)) {
    return 'Укажите корректный Telegram username.';
  }

  return '';
}

function normalizeTelegramUsername(value) {
  const trimmed = value.trim();
  return trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
}

function toWebhookPhotoId(photoUrl) {
  const decoded = decodeURI(photoUrl);
  const withoutRoot = decoded.replace(/^photos\//, '');
  const withoutExtension = withoutRoot.replace(/\.jpg$/i, '');
  return withoutExtension
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
}

function buildOrderId() {
  return `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function buildActivationBotUrl(orderId) {
  const base = WEBHOOK_ORDER_CONFIG.activationBotUrl;
  if (!base || !orderId) return base || '#';
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}start=${encodeURIComponent(orderId)}`;
}

function setOrderBotLink(orderId = '') {
  elements.orderBotLink.href = buildActivationBotUrl(orderId);
}

function isWebhookOrderConfigured() {
  return Boolean(
    WEBHOOK_ORDER_CONFIG.webhookUrl &&
      WEBHOOK_ORDER_CONFIG.webhookSecret &&
      WEBHOOK_ORDER_CONFIG.githubOwner &&
      WEBHOOK_ORDER_CONFIG.githubRepo &&
      WEBHOOK_ORDER_CONFIG.activationBotUrl
  );
}

function buildOrderPayload(customer) {
  const items = getCartViewItems();
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
  const photoIds = items.flatMap((item) =>
    Array.from({ length: item.qty }, () => toWebhookPhotoId(item.photo.url))
  );
  const orderId = buildOrderId();

  const auth = window.__auth;
  const userId = auth?.getCurrentUser()?.id || null;

  return {
    order_id: orderId,
    user_id: userId,
    telegram_chat_id: '',
    telegram_username: normalizeTelegramUsername(customer.telegram),
    photo_ids: photoIds,
    github_owner: WEBHOOK_ORDER_CONFIG.githubOwner,
    github_repo: WEBHOOK_ORDER_CONFIG.githubRepo,
    customer_full_name: customer.fullName,
    customer_email: customer.email,
    total_qty: totalQty,
    total_price: totalPrice,
  };
}

async function sendOrderToWebhook(order) {
  let response;
  try {
    response = await fetch(WEBHOOK_ORDER_CONFIG.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': WEBHOOK_ORDER_CONFIG.webhookSecret,
      },
      body: JSON.stringify(order),
    });
  } catch {
    throw new Error(
      'Не удалось обратиться к webhook. Проверьте URL, HTTPS и CORS в n8n.'
    );
  }

  const responseText = await response.text();
  let result = null;

  if (responseText) {
    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(`Webhook вернул не-JSON ответ (HTTP ${response.status}).`);
    }
  }

  if (!response.ok) {
    const message =
      result && typeof result === 'object' && 'message' in result
        ? String(result.message)
        : `Ошибка webhook (HTTP ${response.status}).`;
    throw new Error(message);
  }

  if (!responseText) {
    throw new Error('Webhook вернул пустой ответ. Проверьте, что активен правильный workflow обработки заказа.');
  }

  const normalized = Array.isArray(result) ? result[0] : result;
  if (!normalized || typeof normalized !== 'object') {
    throw new Error(`Некорректный ответ webhook (HTTP ${response.status}).`);
  }

  if ('status' in normalized && normalized.status !== 'ok') {
    throw new Error(
      'message' in normalized && normalized.message
        ? String(normalized.message)
        : `Ошибка webhook (HTTP ${response.status}).`
    );
  }

  if (!('order_id' in normalized) || !normalized.order_id) {
    throw new Error('Webhook не вернул order_id. Проверьте ответ ноды Respond 200.');
  }

  return normalized;
}

async function handleOrderSubmit(event) {
  event.preventDefault();
  if (state.isOrderSubmitting) return;

  if (state.cart.length === 0) {
    setOrderFormError('Корзина пустая. Добавьте фото перед оформлением.');
    return;
  }

  const rawForm = {
    fullName: elements.orderFullName.value.trim(),
    email: elements.orderEmail.value.trim(),
    telegram: elements.orderTelegram.value.trim(),
  };

  const validationError = validateOrderFields(rawForm);
  if (validationError) {
    setOrderFormError(validationError);
    return;
  }

  if (!isWebhookOrderConfigured()) {
    setOrderFormError('Интеграция webhook не настроена. Заполните WEBHOOK_ORDER_CONFIG в script.js.');
    return;
  }

  const customer = {
    fullName: rawForm.fullName,
    email: rawForm.email,
    telegram: rawForm.telegram,
  };

  setOrderFormError('');
  setOrderSubmitState(true);

  try {
    const order = buildOrderPayload(customer);
    const result = await sendOrderToWebhook(order);
    if (result.bot_link) {
      elements.orderBotLink.href = String(result.bot_link);
    } else {
      const deliveredOrderId = result.order_id || order.order_id;
      setOrderBotLink(deliveredOrderId);
    }
    clearCart();
    elements.orderForm.reset();
    closeOrderModal();
    openOrderSuccessModal();
  } catch (error) {
    setOrderFormError(error instanceof Error ? error.message : 'Ошибка отправки заказа.');
  } finally {
    setOrderSubmitState(false);
  }
}

function shufflePhotos(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function formatRub(value) {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

function loadCart() {
  try {
    const raw = localStorage.getItem('sleeping-pashka-cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistCart() {
  localStorage.setItem('sleeping-pashka-cart', JSON.stringify(state.cart));
}
