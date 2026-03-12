const { useEffect, useLayoutEffect, useMemo, useRef, useState } = React;

if (window.gsap && window.Flip) {
  window.gsap.registerPlugin(window.Flip);
}

const CATEGORY_LABELS = {
  nature: 'На природе',
  floor: 'На полу',
  friends: 'С друзьями',
  party: 'На вечеринке',
  closeup: 'Крупный план',
  couch: 'На диване',
  objects: 'Коллекция "Павел и предметы"',
};

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

const BASE_PRICES = {
  nature: 930,
  floor: 680,
  friends: 990,
  party: 1140,
  closeup: 860,
  couch: 760,
  objects: 1010,
};

const PHOTO_ITEMS = Object.entries(CATEGORY_FILES).flatMap(([category, files]) =>
  files.map((fileName, index) => ({
    id: `${category}-${index + 1}`,
    title: buildPhotoTitle(category, fileName, index),
    category,
    price: BASE_PRICES[category] + (index % 4) * 70,
    url: encodeURI(`photos/${CATEGORY_FOLDERS[category]}/${fileName}`),
  }))
);

const FILTERS = [
  { key: 'all', label: 'Все фото' },
  { key: 'nature', label: 'На природе' },
  { key: 'floor', label: 'На полу' },
  { key: 'friends', label: 'С друзьями' },
  { key: 'party', label: 'На вечеринке' },
  { key: 'closeup', label: 'Крупный план' },
  { key: 'couch', label: 'На диване' },
  { key: 'objects', label: 'Коллекция "Павел и предметы"' },
];

function FlipRevealItem({ flipKey, children, ...props }) {
  return (
    <div data-flip={flipKey} {...props}>
      {children}
    </div>
  );
}

function FlipReveal({ keys, showClass = 'is-visible', hideClass = 'is-hidden', children, ...props }) {
  const wrapperRef = useRef(null);
  const signature = keys.join('|');

  const isShow = (key) => key && (keys.includes('all') || keys.includes(key));

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;

    const items = window.gsap
      ? window.gsap.utils.toArray('[data-flip]', wrapperRef.current)
      : Array.from(wrapperRef.current.querySelectorAll('[data-flip]'));

    if (!items.length) return;

    const canAnimate = Boolean(window.gsap && window.Flip);
    const state = canAnimate ? window.Flip.getState(items) : null;

    items.forEach((item) => {
      const key = item.getAttribute('data-flip');
      if (isShow(key)) {
        if (showClass) item.classList.add(showClass);
        if (hideClass) item.classList.remove(hideClass);
      } else {
        if (showClass) item.classList.remove(showClass);
        if (hideClass) item.classList.add(hideClass);
      }
    });

    if (!canAnimate || !state) return;

    window.Flip.from(state, {
      duration: 0.6,
      scale: true,
      ease: 'power1.inOut',
      stagger: 0.05,
      absolute: true,
      onEnter: (elements) =>
        window.gsap.fromTo(
          elements,
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.8 }
        ),
      onLeave: (elements) => window.gsap.to(elements, { opacity: 0, scale: 0, duration: 0.8 }),
    });
  }, [signature, showClass, hideClass]);

  return (
    <div ref={wrapperRef} {...props}>
      {children}
    </div>
  );
}

function App() {
  const randomizedPhotos = useMemo(() => shufflePhotos(PHOTO_ITEMS), []);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState(() => loadCart());
  const [isCartOpen, setCartOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  const cartView = useMemo(
    () =>
      cart
        .map((entry) => {
          const photo = PHOTO_ITEMS.find((item) => item.id === entry.photoId);
          if (!photo) return null;

          return {
            ...entry,
            photo,
            subtotal: photo.price * entry.qty,
          };
        })
        .filter(Boolean),
    [cart]
  );

  const totalCount = useMemo(
    () => cartView.reduce((sum, item) => sum + item.qty, 0),
    [cartView]
  );

  const totalPrice = useMemo(
    () => cartView.reduce((sum, item) => sum + item.subtotal, 0),
    [cartView]
  );

  useEffect(() => {
    persistCart(cart);
  }, [cart]);

  useEffect(() => {
    document.body.style.overflow = lightboxPhoto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxPhoto]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      if (lightboxPhoto) setLightboxPhoto(null);
      if (isCartOpen) setCartOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxPhoto, isCartOpen]);

  const addToCart = (photoId) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.photoId === photoId);
      if (existing) {
        return prev.map((item) =>
          item.photoId === photoId ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...prev, { photoId, qty: 1 }];
    });
    setCartOpen(true);
  };

  const decrementFromCart = (photoId) => {
    setCart((prev) => {
      const item = prev.find((e) => e.photoId === photoId);
      if (!item) return prev;
      if (item.qty > 1) {
        return prev.map((e) => (e.photoId === photoId ? { ...e, qty: e.qty - 1 } : e));
      }
      return prev.filter((e) => e.photoId !== photoId);
    });
  };

  const clearCart = () => setCart([]);

  const filterKeys = activeCategory === 'all' ? ['all'] : [activeCategory];

  return (
    <>
      <div className="bg-glow bg-glow--left"></div>
      <div className="bg-glow bg-glow--right"></div>

      <header className="header shell">
        <a className="brand" href="#">
          <span className="brand__dot"></span>
          <span className="brand__title">Спящий Пашка</span>
        </a>

        <nav className="header__categories" aria-label="Категории">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              className={`chip ${activeCategory === filter.key ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </nav>

        <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Открыть корзину">
          <span className="cart-btn__label">Корзина</span>
          <span className="cart-btn__count-wrap">
            <span className="cart-btn__count">{totalCount}</span>
          </span>
        </button>
      </header>

      <main className="shell">
        <section className="hero-quote reveal">
          <div>
            <p className="eyebrow">Сонная хроника</p>
            <h1>
              Пашка так любит поспать, что находит подушку даже там, где остальные видят
              просто жизнь.
            </h1>
            <p>Немного нежности, немного шутки и много честной сонной магии в каждом кадре.</p>
          </div>
        </section>

        <FlipReveal className="gallery" keys={filterKeys} showClass="is-show" hideClass="is-hide">
          {randomizedPhotos.map((item, index) => (
            <FlipRevealItem
              key={item.id}
              flipKey={item.category}
              className="gallery-item"
              style={{ animationDelay: `${Math.min(index * 0.04, 0.24)}s` }}
            >
              <button
                className="gallery-item__button"
                aria-label="Увеличить фото"
                onClick={() => setLightboxPhoto(item)}
              >
                <img src={item.url} alt={item.title} loading="lazy" />
              </button>
            </FlipRevealItem>
          ))}
        </FlipReveal>
      </main>

      <aside className={`cart ${isCartOpen ? 'is-open' : ''}`} aria-label="Корзина">
        <div className="cart__header">
          <h3>Корзина</h3>
          <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Закрыть корзину">
            ×
          </button>
        </div>

        <ul className={`cart__list${cartView.length === 0 ? ' is-empty' : ''}`}>
          {cartView.length === 0 ? (
            <li className="cart-empty">ПУСТО</li>
          ) : (
            cartView.map((item) => (
              <li className="cart-item" key={item.photo.id}>
                <button
                  className="cart-item__preview"
                  onClick={() => setLightboxPhoto(item.photo)}
                  aria-label="Открыть фото"
                >
                  <img src={item.photo.url} alt="Фото" />
                </button>
                <div>
                  <p className="cart-item__title">{item.photo.title}</p>
                  <p className="cart-item__price">{item.qty} × {formatRub(item.photo.price)}</p>
                </div>
                <div className="cart-item__actions">
                  <div className="cart-item__qty-controls">
                    <button
                      className="cart-item__step"
                      onClick={() => decrementFromCart(item.photo.id)}
                      aria-label="Уменьшить количество"
                    >−</button>
                    <span className="cart-item__qty">{item.qty}</span>
                    <button
                      className="cart-item__step"
                      onClick={() => addToCart(item.photo.id)}
                      aria-label="Увеличить количество"
                    >+</button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        <div className="cart__footer">
          <button className="btn cart__clear" onClick={clearCart}>Удалить всё</button>
          <div className="cart__total">
            <span>Итого</span>
            <strong>{formatRub(totalPrice)}</strong>
          </div>
          <button className="btn cart__checkout">Оформить</button>
        </div>
      </aside>

      <div className={`overlay ${isCartOpen ? 'is-visible' : ''}`} onClick={() => setCartOpen(false)}></div>

      <div
        className={`lightbox ${lightboxPhoto ? 'is-open' : ''}`}
        aria-hidden={lightboxPhoto ? 'false' : 'true'}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setLightboxPhoto(null);
          }
        }}
      >
        {lightboxPhoto && (
          <>
            <button
              className="lightbox__close"
              onClick={() => setLightboxPhoto(null)}
              aria-label="Закрыть фото"
            >
              ×
            </button>
            <div className="lightbox__panel">
              <img src={lightboxPhoto.url} alt={lightboxPhoto.title} />
              <div className="lightbox__actions">
                <button className="btn btn--small" onClick={() => addToCart(lightboxPhoto.id)}>
                  В корзину
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function buildPhotoTitle(category, fileName, index) {
  const match = fileName.match(/^photo_(\d+)/i);
  const photoNumber = match ? match[1] : String(index + 1);
  return `${CATEGORY_LABELS[category]}: фото ${photoNumber}`;
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

function persistCart(cart) {
  localStorage.setItem('sleeping-pashka-cart', JSON.stringify(cart));
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
