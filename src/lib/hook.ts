import { useEffect, useState } from "react";

/**
 * Gets bounding boxes for an element. This is implemented for you
 */
export function getElementBounds(elem: HTMLElement) {
  const bounds = elem.getBoundingClientRect();
  const top = bounds.top + window.scrollY;
  const left = bounds.left + window.scrollX;

  return {
    x: left,
    y: top,
    top,
    left,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * **TBD:** Implement a function that checks if a point is inside an element
 */
export function isPointInsideElement(
  coordinate: { x: number; y: number },
  element: HTMLElement
): boolean {
  const elementBounds = getElementBounds(element);

  return (
    coordinate.x >= elementBounds.left &&
    coordinate.x <= elementBounds.left + elementBounds.width &&
    coordinate.y >= elementBounds.top &&
    coordinate.y <= elementBounds.top + elementBounds.height
  );
}

/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  const findFirstLine = (node: Node): Text | null => {
    const queue: Node[] = [node];
  
    while (queue.length) {
      const current = queue.shift();
  
      if (current.nodeType === Node.TEXT_NODE && current.nodeValue?.trim().length) {
        return current as Text;
      }
  
      if (current.firstChild) {
        queue.push(current.firstChild);
      }
  
      if (current.nextSibling) {
        queue.push(current.nextSibling);
      }
    }
  
    return null;
  };

  const firstLine = findFirstLine(element);

  if (!firstLine?.parentElement) return 0;

  const { lineHeight } = window.getComputedStyle(firstLine.parentElement);
  return Number.isNaN(parseInt(lineHeight)) ? 0 : parseInt(lineHeight);
}

export type HoveredElementInfo = {
  element: HTMLElement;
  top: number;
  left: number;
  heightOfFirstLine: number;
};

/**
 * **TBD:** Implement a React hook to be used to help to render hover player
 * Return the absolute coordinates on where to render the hover player
 * Returns null when there is no active hovered paragraph
 * Note: If using global event listeners, attach them window instead of document to ensure tests pass
 */
export function useHoveredParagraphCoordinate(
  parsedElements: HTMLElement[]
): HoveredElementInfo | null {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null> (null);

  const handleMouseOver = (event: MouseEvent) => {
    const { clientX, clientY } = event; 
    for (let element of parsedElements) {
      if (isPointInsideElement({ x: clientX, y: clientY }, element)) {
        setHoveredElement(element);
        return;
      }
    }
  
    setHoveredElement(null);

  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseOver)

    return () => window.removeEventListener("mousemove", handleMouseOver);
  }, [parsedElements])

  if (hoveredElement) {
    const bounds = getElementBounds(hoveredElement);
    const heightOfFirstLine = getLineHeightOfFirstLine(hoveredElement)
    return {
      element: hoveredElement,
      top: bounds.top,
      left: bounds.left,
      heightOfFirstLine,
    }
  }

  return null
}
