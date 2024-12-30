import { useEffect, useState } from 'react';
import { useAudio } from './AudioManager';
import Ball from './Ball';
import './Ball.css';

const TOTAL_NOTES = 9;

const Garland = () => {
  const { playSound } = useAudio();
  const [balls, setBalls] = useState<any[]>([]);

  useEffect(() => {
    const keyToIndexMap: { [key: string]: number } = {
      '49': 0,
      '50': 1,
      '51': 2,
      '52': 3,
      '53': 4,
      '54': 5,
      '55': 6,
      '56': 7,
      '57': 8,
      '48': 9,
      '189': 10,
      '187': 11,
      '81': 12,
      '87': 13,
      '69': 14,
      '82': 15,
      '84': 16,
      '89': 17,
      '85': 18,
      '73': 19,
      '79': 20,
      '80': 21,
      '219': 22,
      '221': 23,
      '65': 24,
      '83': 25,
      '68': 26,
      '70': 27,
      '71': 28,
      '72': 29,
      '74': 30,
      '75': 31,
      '76': 32,
      '186': 33,
      '222': 34,
      '220': 35,
      // Include additional mappings if needed
    };

    const handleKeyDown = async (event: KeyboardEvent) => {
      const keyCode = event.key;
      const index = keyToIndexMap[keyCode];
      if (index !== undefined && index < TOTAL_NOTES) {
        await playSound(index);
        const ball = document.querySelector(`[data-note="${index}"]`) as HTMLElement;
        if (ball) {
          ball.classList.add('bounce');
          setTimeout(() => ball.classList.add('bounce1'), 300);
          setTimeout(() => ball.classList.add('bounce2'), 600);
          setTimeout(() => ball.classList.add('bounce3'), 900);
          setTimeout(() => ball.classList.remove('bounce', 'bounce1', 'bounce2', 'bounce3'), 1200);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playSound]);

  // Generate balls based on the number of sounds
  useEffect(() => {
    const sounds = Array.from({length: 7}, (_, layer) => (
        getUniqueRandomNumbers(9, 1, 36)
    ))

    setBalls(
      Array.from({ length: 7 }, (_, layer) => (
        <div
          key={layer}
          className={`b-head-decor__inner b-head-decor__inner_n${layer + 1}`}
        >
          {Array.from({ length: TOTAL_NOTES }, (_, i) => (
            <Ball
              key={i}
              note={sounds[layer][i]}
            />
          ))}
        </div>
      ))
    );
  }, []);

  return (
    <div className='b-page_newyear' style={{zIndex: 0}}>
      <div className='b-page__content'>
        <div className='b-head-decor'>{balls.map((ball) => ball)}</div>
      </div>
    </div>
  );
};

export default Garland;

function getUniqueRandomNumbers(count: number, min: number, max: number) {
  // Создаем массив чисел от 1 до 36
  const numbers = Array.from({ length: 36 }, (_, i) => i + 1);

  // Группируем числа по их остатку при делении на 9
  const groups: any = Array.from({ length: 9 }, () => []);

  numbers.forEach((num: number) => {
    const mod = num % 9;
    // Если остаток 0, помещаем в последнюю группу (индекс 8)
    groups[mod === 0 ? 8 : mod - 1].push(num);
  });

  // Проверяем, что каждая группа имеет хотя бы одно число
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].length === 0) {
      throw new Error(`Группа ${i + 1} пуста. Невозможно сгенерировать массив.`);
    }
  }

  // Выбираем по одному случайному числу из каждой группы
  const selected = groups.map((group: any) => {
    const randomIndex = Math.floor(Math.random() * group.length);
    return group[randomIndex];
  });

  // Функция для перемешивания массива (алгоритм Фишера-Йетса)
  function shuffle(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Перемешиваем выбранные числа для большей случайности
  return shuffle(selected);
}
