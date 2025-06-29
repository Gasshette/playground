/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, RefObject, MouseEvent, useCallback } from 'react';
import './Scrollbar.scss';

interface ScrollbarProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  className?: string;
}

export const Scrollbar = (props: ScrollbarProps) => {
  const { scrollContainerRef, className = '' } = props;

  const [isDragging, setIsDragging] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isParentHovered, setIsParentHovered] = useState(false);

  const thumbRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const checkOverflow = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      setHasOverflow(false);
      return false;
    }

    const overflow = container.scrollWidth > container.clientWidth;
    setHasOverflow(overflow);
    return overflow;
  }, [scrollContainerRef]);

  const updateThumbPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    const thumb = thumbRef.current;
    if (!container || !thumb) return;

    const ratio = container.clientWidth / container.scrollWidth;
    const thumbWidth = container.clientWidth * ratio;
    thumb.style.width = `${thumbWidth}px`;

    const scrollRatio = container.scrollLeft / (container.scrollWidth - container.clientWidth);
    const maxLeft = container.clientWidth - thumbWidth;
    thumb.style.left = `${scrollRatio * maxLeft}px`;
  }, [scrollContainerRef]);

  const handleMouseMove = useCallback(
    (event: MouseEvent<Document>) => {
      if (!isDraggingRef.current) return;

      const deltaX = event.clientX - startXRef.current;
      const container = scrollContainerRef.current;
      const thumb = thumbRef.current;
      if (!container || !thumb) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const maxThumbLeft = container.clientWidth - thumb.offsetWidth;

      const scrollDelta = (deltaX / maxThumbLeft) * maxScrollLeft;
      container.scrollLeft = startScrollLeftRef.current + scrollDelta;

      updateThumbPosition();
    },
    [isDraggingRef, scrollContainerRef, updateThumbPosition]
  );

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;

    scrollContainerRef.current.style.userSelect = 'none';
    isDraggingRef.current = true;
    startXRef.current = event.clientX;
    startScrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    setIsDragging(true);

    document.addEventListener('mousemove', handleMouseMove as any);
    document.addEventListener('mouseup', handleMouseUp);

    event.preventDefault();
    event.stopPropagation();
  };

  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current || !thumbRef.current) return;
    if (event.target === thumbRef.current) return;

    const container = scrollContainerRef.current;
    const thumb = thumbRef.current;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    const trackWidth = rect.width;
    const thumbWidth = thumb.offsetWidth;

    const targetThumbLeft = clickX - thumbWidth / 2;
    const maxThumbLeft = trackWidth - thumbWidth;
    const clampedThumbLeft = Math.max(0, Math.min(targetThumbLeft, maxThumbLeft));

    const scrollRatio = clampedThumbLeft / maxThumbLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const targetScrollLeft = scrollRatio * maxScrollLeft;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    isDraggingRef.current = false;

    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.userSelect = '';
    }

    document.removeEventListener('mousemove', handleMouseMove as any);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, scrollContainerRef]);

  // Set up parent hover detection
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Find the parent that should trigger hover (look for common wrapper classes)
    let parentElement = container.parentElement;
    while (parentElement && !parentElement.classList.contains('file-list-wrapper')) {
      parentElement = parentElement.parentElement;
    }

    // Fallback to direct parent if no wrapper found
    if (!parentElement) {
      parentElement = container.parentElement;
    }

    if (!parentElement) return;

    const handleMouseEnter = () => setIsParentHovered(true);
    const handleMouseLeave = () => setIsParentHovered(false);

    parentElement.addEventListener('mouseenter', handleMouseEnter);
    parentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      parentElement?.removeEventListener('mouseenter', handleMouseEnter);
      parentElement?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [scrollContainerRef]);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;

    // Hide native scrollbars
    const originalScrollbarWidth = container.style.scrollbarWidth;
    const originalMsOverflowStyle = (container.style as any).msOverflowStyle;

    container.style.scrollbarWidth = 'none'; // Firefox
    (container.style as any).msOverflowStyle = 'none'; // IE/Edge
    container.classList.add('custom-scrollbar-container'); // For webkit

    const onScroll = () => updateThumbPosition();

    const onWheel = (event: WheelEvent) => {
      if (!container) return;

      event.preventDefault();
      const scrollAmount = event.deltaY * 0.5;
      container.scrollLeft += scrollAmount;
      updateThumbPosition();
    };

    const onResize = () => {
      checkOverflow();
      updateThumbPosition();
    };

    container.addEventListener('scroll', onScroll);
    container.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);

    checkOverflow();
    updateThumbPosition();

    return () => {
      // Restore original scrollbar styles
      container.style.scrollbarWidth = originalScrollbarWidth;
      (container.style as any).msOverflowStyle = originalMsOverflowStyle;
      container.classList.remove('custom-scrollbar-container');

      container.removeEventListener('scroll', onScroll);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      handleMouseUp();
    };
  }, [scrollContainerRef, checkOverflow, handleMouseUp, updateThumbPosition]);

  useEffect(() => {
    checkOverflow();
    updateThumbPosition();
  });

  const scrollbarClasses = [
    'custom-scrollbar',
    className,
    isDragging ? 'dragging' : '',
    hasOverflow ? 'has-overflow' : '',
    isParentHovered ? 'parent-hovered' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={scrollbarClasses}>
      <div className="scrollbar-track" onClick={handleTrackClick}>
        <div className="scrollbar-thumb" ref={thumbRef} onMouseDown={handleMouseDown} />
      </div>
    </div>
  );
};
