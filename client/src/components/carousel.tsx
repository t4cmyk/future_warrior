import React, { createRef, useEffect, useRef, useState } from "react";
import CarouselController from "./carouselController";

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
  render: (elem: ElementType) => JSX.Element;
  focusElement?: ElementType;
  onScroll?: (song?: ElementType) => any;
  onClick?: (song: ElementType) => any;
  onDoubleClick: (song: ElementType) => any;
  onContextMenu: (song: ElementType) => any;
  registerSongListChange?: (callback: () => any) => () => any;
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

  const renderDivContent = (idx: number) => {
    if (!controller || props.elementList.length === 0) return <></>;
    const elemIdx =
      (controller.getElemIdxFromDivIdx(idx) - renderOffset) %
      props.elementList.length;
    if (isNaN(elemIdx)) return <></>;
    return props.render(
      props.elementList[
        elemIdx < 0 ? elemIdx + props.elementList.length : elemIdx
      ]
    );
  };

  let divElements = divRefs.map((ref, i) => {
    return (
      <div
        ref={ref}
        key={i}
        style={{ position: "absolute", maxWidth: props.width }}
      >
        {renderDivContent(i)}
      </div>
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
