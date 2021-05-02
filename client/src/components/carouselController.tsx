function xpos(e: TouchEvent | MouseEvent) {
  if (
    window.TouchEvent &&
    e instanceof TouchEvent &&
    e.targetTouches.length >= 1
  )
    return e.targetTouches[0].clientX;
  return (e as MouseEvent).clientX;
}

export default class CarouselController<ElementType> {
  private view: HTMLDivElement;
  private divs: HTMLDivElement[];
  private _elementList: Readonly<Array<ElementType>> = [];
  private offset = 0;
  private dim = 0;
  private _infinite = false;

  private timestamp = 0;
  private pressed = false;
  private reference = 0;
  private velocity = 0;
  private amplitude = 0;
  private frame = 0;
  private ticker = 0;

  private target = 0;

  get elementList() {
    return this._elementList;
  }
  set elementList(list: Readonly<Array<ElementType>>) {
    this._elementList = list;
    this.handleElementListChanged();
  }

  private updateOffset: (offset: number) => void;
  resizeCallback?: (imageDim: number) => any;
  canScroll?: () => boolean;
  onScroll?: (elem?: ElementType) => any;
  onClick?: (elem: ElementType) => any;
  onDoubleClick?: (elem: ElementType) => any;
  onContextMenu?: (elem: ElementType) => any;

  shift: number;
  dist: number;
  angle: number;
  timeConstant: number;

  get divElements(): HTMLDivElement[] {
    return this.divs;
  }

  set divElements(val: HTMLDivElement[]) {
    this.divs = val;
    this.setupImageEvents();
    this.scroll();
  }

  private get divCount() {
    return this.divs.length;
  }

  constructor(
    view: HTMLDivElement,
    divs: HTMLDivElement[],
    dim: number,
    shift: number,
    dist: number,
    angle: number,
    timeConstant: number,
    updateOffset: (offset: number) => void,
    resizeCallback?: (imageDim: number) => any
  ) {
    this.view = view;
    this.divs = divs;
    this.dim = dim;
    this.shift = shift;
    this.dist = dist;
    this.angle = angle;
    this.timeConstant = timeConstant;
    this.updateOffset = updateOffset;
    this.resizeCallback = resizeCallback;
    this.autoScroll = this.autoScroll.bind(this);
    this.scroll = this.scroll.bind(this);
    this.tap = this.tap.bind(this);
    this.track = this.track.bind(this);
    this.drag = this.drag.bind(this);
    this.release = this.release.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.onResize = this.onResize.bind(this);
    this.handleElementListChanged = this.handleElementListChanged.bind(this);
    this.setupEvents();
    this.setupImageEvents();
    this.onResize();
  }

  setupImageEvents() {
    this.divs.forEach((div) => {
      div.onclick = (ev: MouseEvent) => {
        if (!this.onClick) return;
        if (div !== this.divs[this.wrap(this.centerIdx)]) return;
        let elem = this.getElement(this.centerIdx);
        if (Math.abs(this.offset - this.centerIdx * this.dim) > 5) return;
        this.onClick(elem);
        ev.preventDefault();
        ev.stopPropagation();
      };
      div.ondblclick = (ev: MouseEvent) => {
        if (!this.onDoubleClick) return;
        if (div !== this.divs[this.wrap(this.centerIdx)]) return;
        let elem = this.getElement(this.centerIdx);
        this.onDoubleClick(elem);
        ev.preventDefault();
        ev.stopPropagation();
      };
      div.oncontextmenu = (ev: MouseEvent) => {
        if (!this.onContextMenu) return;
        if (div !== this.divs[this.wrap(this.centerIdx)]) return;
        let elem = this.getElement(this.centerIdx);
        this.onContextMenu(elem);
        ev.preventDefault();
        ev.stopPropagation();
      };
    });
  }

  setupEvents() {
    let view = this.view;
    window.addEventListener("resize", this.onResize);
    view.addEventListener("touchstart", this.tap);
    view.addEventListener("touchmove", this.drag);
    view.addEventListener("touchend", this.release);
    view.addEventListener("mousedown", this.tap);
    view.addEventListener("mousemove", this.drag);
    view.addEventListener("mouseup", this.release);
    view.addEventListener("mouseleave", this.release);
    document.addEventListener("wheel", this.handleWheel);
    document.addEventListener("keydown", this.handleKey);
  }

  destroy() {
    window.removeEventListener("resize", this.onResize);
    this.view.removeEventListener("touchstart", this.tap);
    this.view.removeEventListener("touchmove", this.drag);
    this.view.removeEventListener("touchend", this.release);
    this.view.removeEventListener("mousedown", this.tap);
    this.view.removeEventListener("mousemove", this.drag);
    this.view.removeEventListener("mouseup", this.release);
    this.view.removeEventListener("mouseleave", this.release);
    document.removeEventListener("wheel", this.handleWheel);
    document.removeEventListener("keydown", this.handleKey);
    if (this.animationRequest) {
      cancelAnimationFrame(this.animationRequest);
      this.animationRequest = undefined;
    }
  }

  /**
   * Wrap an index number to a valid number of divs in the carousel.
   * @param x input index
   * @returns a index number between 0 and (number of divs - 1) representing the input index
   */
  wrap(x: number): number {
    const count = this.divCount;
    return x >= count ? x % count : x < 0 ? this.wrap(count + (x % count)) : x;
  }

  /** Returns the element index of the div visible in the center of the carousel.
   * This value is NOT wrapped to the number of elements */
  get centerIdx(): number {
    if (!this.dim) return Math.floor(this.divs.length / 2.0);
    return Math.floor((this.offset + this.dim / 2) / this.dim);
  }

  private isInScrollRange(index: number) {
    if (this._infinite) return true;
    if (index < 0 || index >= this._elementList.length) return false;
    return true;
  }

  scroll(x?: number) {
    let oldOffset = this.offset;
    let oldCenter = this.centerIdx;
    this.offset = typeof x === "number" ? x : this.offset;
    let center = this.centerIdx;
    if (!this.isInScrollRange(center) && this.isInScrollRange(oldCenter)) {
      this.offset = oldOffset;
      center = this.centerIdx;
    }
    const delta = this.offset - center * this.dim;
    const dir = delta < 0 ? 1 : -1;
    const tween = (-dir * delta * 2) / this.dim;

    const width = this.view.clientWidth;
    const height = this.view.clientHeight;

    const alignment = `translateX(${(width - this.dim) / 2}px) translateY(${
      /*height -this.dim / 2*/ 0
    }px)`;

    const calcOpacity = (imgIdx: number, direction: number) => {
      if (!this.isInScrollRange(center + direction * imgIdx)) return 0;

      return imgIdx === half && -direction * delta > 0 ? 1 - tween : 1;
    };

    const half = this.divCount >> 1;
    for (let i = 1; i <= half; ++i) {
      // right side
      let el = this.divs[this.wrap(center + i)];
      el.style.transform = `${alignment} translateX(${
        this.shift + (this.dim * i - delta) / 2
      }px) translateZ(${this.dist}px) rotateY(${this.angle}deg)`;
      el.style.zIndex = (-i).toString();
      el.style.opacity = calcOpacity(i, 1).toString();

      // left side
      el = this.divs[this.wrap(center - i)];
      el.style.transform = `${alignment} translateX(${
        -this.shift + (-this.dim * i - delta) / 2
      }px) translateZ(${this.dist}px) rotateY(${-this.angle}deg)`;
      el.style.zIndex = (-i).toString();
      el.style.opacity = calcOpacity(i, -1).toString();
    }

    // center
    let el = this.divs[this.wrap(center)];
    el.style.transform = `${alignment} translateX(${-delta / 2}px) translateX(${
      dir * this.shift * tween
    }px) translateZ(${this.dist * tween}px) rotateY(${
      dir * this.angle * tween
    }deg)`;
    el.style.zIndex = "0";
    el.style.opacity = this.isInScrollRange(center) ? "1" : "0";
    /*this.title.style.opacity = this.isInScrollRange(center)
      ? Math.sqrt(1 - Math.abs(tween)).toString()
      : "0";*/
    this.updateOffset(this.centerIdx);
    if (this.onScroll) {
      if (this._elementList.length > 0)
        this.onScroll(this.getElement(this.centerIdx));
      else this.onScroll();
    }
  }

  getElemIdxFromDivIdx(divIdx: number) {
    const absoluteIdx =
      this.centerIdx + (divIdx - Math.floor(this.divCount / 2.0));
    const wrappedIdx = absoluteIdx % this._elementList.length;
    return wrappedIdx < 0 ? wrappedIdx + this._elementList.length : wrappedIdx;
  }

  getElement(idx: number) {
    let result = idx % this._elementList.length;
    if (result < 0) result += this._elementList.length;
    return this._elementList[result];
  }

  private handleElementListChanged() {
    // if (this.updateImgSrc()) this.scroll();
    if (this._elementList.length > 0 && !this.isInScrollRange(this.centerIdx))
      this.snapToIdx(this._elementList.length - 1);
  }

  tap(e: TouchEvent | MouseEvent) {
    this.pressed = true;
    this.reference = xpos(e);

    this.velocity = this.amplitude = 0;
    this.frame = this.offset;
    this.timestamp = Date.now();
    clearInterval(this.ticker);
    this.ticker = window.setInterval(this.track, 100);

    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  drag(e: TouchEvent | MouseEvent) {
    if (this.pressed) {
      const x = xpos(e);
      const delta = this.reference - x;
      if (delta > 2 || delta < -2) {
        this.reference = x;
        this.scroll(this.offset + delta);
      }
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  release(e: TouchEvent | MouseEvent) {
    if (!this.pressed) return false;
    this.pressed = false;

    clearInterval(this.ticker);
    let targetPos = this.offset;
    if (this.velocity > 10 || this.velocity < -10)
      targetPos += 0.9 * this.velocity;
    this.snapToPosition(targetPos);

    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  track() {
    const now = Date.now();
    const elapsed = now - this.timestamp;
    this.timestamp = now;
    const delta = this.offset - this.frame;
    this.frame = this.offset;

    const v = (1000 * delta) / (1 + elapsed);
    this.velocity = 0.8 * v + 0.2 * this.velocity;
  }

  handleWheel(e: WheelEvent) {
    if (this.pressed || (this.canScroll && !this.canScroll())) return;

    let targetPos: number | undefined = undefined;
    if (e.deltaY > 0) targetPos = this.target + this.dim;
    else if (e.deltaY < 0) targetPos = this.target - this.dim;
    if (targetPos !== undefined) {
      this.snapToPosition(targetPos);
      return true;
    }
  }

  handleKey(e: KeyboardEvent) {
    if (this.pressed || (this.canScroll && !this.canScroll())) return;

    let targetPos: number | undefined = undefined;
    // Space or PageDown or RightArrow or DownArrow
    if ([32, 34, 39, 40].indexOf(e.which) >= 0) {
      targetPos = this.target + this.dim;
    }
    // PageUp or LeftArrow or UpArrow
    if ([33, 37, 38].indexOf(e.which) >= 0) {
      targetPos = this.target - this.dim;
    }
    if (targetPos !== undefined) {
      this.snapToPosition(targetPos);
      return true;
    }
  }

  onResize() {
    //    return;
    if (this.divs.length == 0) return;
    let oldDim = this.dim;
    //    this.dim = this.divs[0].clientHeight; //height;
    if (oldDim && this.offset)
      this.offset =
        ((this.offset + oldDim / 2) / oldDim) * this.dim - this.dim / 2;
    if (this.resizeCallback) this.resizeCallback(this.dim);
    this.scroll();
  }

  private animationRequest?: number;

  snapToIdx(idx: number) {
    if (!this._infinite && idx < 0) idx = 0;
    if (!this._infinite && idx >= this._elementList.length)
      idx = this._elementList.length - 1;
    const newTarget = idx * this.dim;
    if (newTarget === this.target && this.animationRequest) return;
    this.target = newTarget;
    this.amplitude = this.target - this.offset;
    this.timestamp = Date.now();
    if (this.animationRequest === undefined && this.amplitude !== 0)
      this.animationRequest = requestAnimationFrame(this.autoScroll);
  }

  snapToPosition(position: number) {
    this.snapToIdx(Math.round(position / this.dim));
  }

  autoScroll() {
    if (this.amplitude) {
      const elapsed = Date.now() - this.timestamp;
      const delta = this.amplitude * Math.exp(-elapsed / this.timeConstant);
      if (Math.abs(delta) > 0.25) {
        this.scroll(this.target - delta);
        this.animationRequest = requestAnimationFrame(this.autoScroll);
        return;
      } else {
        this.scroll(this.target);
      }
    }
    this.animationRequest = undefined;
  }
}
