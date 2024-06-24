import { useEffect, useState, cloneElement, ReactNode } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

import './App.css';

const data = new Array(26).fill(undefined).map((_, idx) => ({
  text: `slide ${idx + 1}`,
}));

const BUFFER = 3;

const wrapArr = (arr: number[]) => {
  if (!arr.length) {
    return [0, 1, 2, 3, 4, 5, 6];
  }

  const newArr: number[] = [...arr];

  console.log('new arra', arr);

  if (newArr[0] < BUFFER && newArr[0] > 0) {
    const limit = BUFFER - newArr[0];
    for (let i = limit; i <= 0; i++) {
      newArr.unshift(i);
    }
  }

  for (let j = 0; j < BUFFER; j++) {
    newArr.push(newArr[newArr.length - 1] + 1);
  }

  return newArr;
};

type Props = {
  children: ReactNode;
};

const Carousel = ({ children }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [visibleChildren, setVisibleChildren] = useState();

  const onScroll = () => {
    if (emblaApi) {
      const slidesInView = emblaApi.slidesInView();

      const visibles = wrapArr(slidesInView);

      const startIndex = visibles[0];
      const endIndex = visibles[visibles.length - 1];

      const newChildren = children
        .slice(startIndex, endIndex + 1)
        .map((child: JSX.Element) => cloneElement(child));

      setVisibleChildren(newChildren);
    }
  };

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', onScroll);
      onScroll();
    }
  }, [emblaApi, children]);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">{visibleChildren}</div>
    </div>
  );
};

const App = () => {
  return (
    <Carousel>
      {data.map((item) => (
        <div className="embla__slide" key={item.text}>
          {item.text}
        </div>
      ))}
    </Carousel>
  );
};

export default App;
