import React, { createRef, useEffect, useRef, useState } from "react";
import CarouselController from "./carouselController";

type RenderFunctionType<ElementType> = (elem: ElementType) => JSX.Element;

interface CarouselProps<ElementType> {
  divCount?: number;
  width: number;
  height?: number;
  angle: number;
  dist: number;
  shift: number;
  timeConstant: number;
  dim?: number;
  elementList: Readonly<Array<ElementType>>;
  render: RenderFunctionType<ElementType>;
  focusElement?: ElementType;
  onScroll?: (song?: ElementType) => any;
  onClick?: (song: ElementType) => any;
  onDoubleClick: (song: ElementType) => any;
  onContextMenu: (song: ElementType) => any;
  registerSongListChange?: (callback: () => any) => () => any;
}

function CarouselElement<ElementType>(props: {
  element?: ElementType;
  divRef: React.RefObject<HTMLDivElement>;
  render: RenderFunctionType<ElementType>;
  width: number;
}) {
  return (
    <div
      ref={props.divRef}
      style={{ position: "absolute", maxWidth: props.width }}
    >
      {props.element ? props.render(props.element) : <></>}
    </div>
  );
}

export function Carousel<ElementType>(props: CarouselProps<ElementType>) {
  const [divCount, setDivCount] = useState(props.divCount || 5);
  const [divRefs, setDivRefs] = useState(
    new Array<React.RefObject<HTMLDivElement>>()
  );
  const [renderOffset, setRenderOffset] = useState(0);
  const [controller, setController] =
    useState<CarouselController<ElementType> | undefined>(undefined);

  const viewRef = useRef<HTMLDivElement>();

  useEffect(() => {
    setDivRefs((divRefs) =>
      Array(divCount)
        .fill(0)
        .map((_, i) => divRefs[i] || createRef())
    );
  }, [divCount]);

  if (controller) {
    if (controller.elementList !== props.elementList)
      controller.elementList = props.elementList;
  }
  useEffect(() => {
    if (divRefs.length == 0) return;

    const controller = new CarouselController<ElementType>(
      viewRef.current,
      divRefs.map((ref) => ref.current),
      props.width,
      props.shift,
      props.dist,
      props.angle,
      props.timeConstant,
      setRenderOffset
    );

    controller.elementList = props.elementList;
    controller.divElements = divRefs.map((elem) => elem.current);
    setController(controller);
    return () => controller.destroy();
  }, [divRefs]);

  useEffect(() => {
    const onResize = () => {
      let divCnt = viewRef.current!.clientWidth / (props.width * 0.5);
      divCnt = Math.floor((divCnt - 1) / 2) * 2 + 1;
      setDivCount(divCnt);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const getElement = (idx: number) => {
    if (!controller || props.elementList.length === 0) return undefined;
    const divCnt = divRefs.length;
    const halfDivCnt = Math.floor(divCnt / 2);
    const overflowCount = Math.floor(
      (renderOffset + halfDivCnt - idx) / divCnt
    );
    const elemIdx = (idx + overflowCount * divCnt) % props.elementList.length;
    if (isNaN(elemIdx)) return undefined;
    return props.elementList[
      elemIdx < 0 ? elemIdx + props.elementList.length : elemIdx
    ];
  };

  let divElements = divRefs.map((ref, i) => {
    return (
      <CarouselElement<ElementType>
        key={i}
        divRef={ref}
        width={props.width}
        element={getElement(i)}
        render={props.render}
      />
    );
  });
  return (
    <div
      ref={viewRef}
      style={{
        height: props.height || props.width,
        perspective: "500px",
        overflow: "visible",
        transformStyle: "preserve-3d",
      }}
    >
      {divElements}
    </div>
  );
}
