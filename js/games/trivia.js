import { el, overlay, shuffle, scoreBar } from '../engine.js';

const BANKS = {
  science: [
    ['What planet is known as the Red Planet?', ['Venus', 'Mars', 'Jupiter', 'Saturn'], 1],
    ['What gas do plants absorb from the air?', ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Helium'], 2],
    ['What is the chemical symbol for gold?', ['Go', 'Gd', 'Au', 'Ag'], 2],
    ['How many bones are in the adult human body?', ['186', '206', '226', '246'], 1],
    ['What force pulls objects toward Earth?', ['Magnetism', 'Friction', 'Gravity', 'Tension'], 2],
    ['What is the powerhouse of the cell?', ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'], 2],
    ['What is the boiling point of water in Celsius?', ['90', '100', '110', '120'], 1],
    ['Which planet has the most moons?', ['Earth', 'Mars', 'Saturn', 'Mercury'], 2],
  ],
  history: [
    ['Who was the first President of the United States?', ['Jefferson', 'Washington', 'Adams', 'Lincoln'], 1],
    ['In what year did World War II end?', ['1943', '1945', '1947', '1950'], 1],
    ['Which ancient civilization built the pyramids of Giza?', ['Romans', 'Greeks', 'Egyptians', 'Mayans'], 2],
    ['The Berlin Wall fell in which year?', ['1985', '1989', '1991', '1993'], 1],
    ['Who wrote the Declaration of Independence?', ['Franklin', 'Jefferson', 'Hamilton', 'Adams'], 1],
    ['Which empire was ruled by Julius Caesar?', ['Ottoman', 'Roman', 'Persian', 'Byzantine'], 1],
    ['The Titanic sank in what year?', ['1905', '1912', '1918', '1923'], 1],
    ['Who was known as the Maid of Orléans?', ['Marie Antoinette', 'Joan of Arc', 'Catherine the Great', 'Cleopatra'], 1],
  ],
  geography: [
    ['What is the longest river in the world?', ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], 1],
    ['Which country has the largest population?', ['USA', 'India', 'China', 'Indonesia'], 2],
    ['What is the smallest country in the world?', ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], 1],
    ['Which desert is the largest in the world?', ['Sahara', 'Gobi', 'Antarctic', 'Kalahari'], 2],
    ['Mount Everest is located in which mountain range?', ['Andes', 'Alps', 'Himalayas', 'Rockies'], 2],
    ['What is the capital of Australia?', ['Sydney', 'Melbourne', 'Canberra', 'Perth'], 2],
    ['Which ocean is the largest?', ['Atlantic', 'Indian', 'Arctic', 'Pacific'], 3],
    ['How many continents are there?', ['5', '6', '7', '8'], 2],
  ],
  movies: [
    ['Who directed "Jaws" and "E.T."?', ['George Lucas', 'Steven Spielberg', 'James Cameron', 'Ridley Scott'], 1],
    ['Which movie features the song "My Heart Will Go On"?', ['The Notebook', 'Titanic', 'La La Land', 'Ghost'], 1],
    ['What is the highest-grossing film of all time (unadjusted)?', ['Avatar', 'Avengers: Endgame', 'Titanic', 'Star Wars'], 0],
    ['Which studio made "Toy Story"?', ['DreamWorks', 'Pixar', 'Illumination', 'Disney Animation'], 1],
    ['Who played Jack in "Titanic"?', ['Brad Pitt', 'Leonardo DiCaprio', 'Matt Damon', 'Tom Cruise'], 1],
    ['"May the Force be with you" is from which franchise?', ['Star Trek', 'Star Wars', 'Dune', 'Guardians of the Galaxy'], 1],
    ['Which movie won Best Picture in 1994?', ['Pulp Fiction', 'Forrest Gump', 'The Lion King', 'Speed'], 1],
    ['Who plays Iron Man in the Marvel films?', ['Chris Evans', 'Chris Hemsworth', 'Robert Downey Jr.', 'Mark Ruffalo'], 2],
  ],
  sports: [
    ['How many players are on a soccer team on the field?', ['9', '10', '11', '12'], 2],
    ['In which sport would you perform a slam dunk?', ['Volleyball', 'Basketball', 'Tennis', 'Baseball'], 1],
    ['How often are the Summer Olympics held?', ['Every 2 years', 'Every 4 years', 'Every 5 years', 'Every 6 years'], 1],
    ['What sport uses a shuttlecock?', ['Tennis', 'Squash', 'Badminton', 'Table tennis'], 2],
    ['How many points is a touchdown worth in American football?', ['3', '6', '7', '8'], 1],
    ['Which country invented table tennis?', ['China', 'Japan', 'England', 'USA'], 2],
    ['In tennis, what is a score of zero called?', ['Nil', 'Love', 'Duck', 'Zero'], 1],
    ['How many rings are on the Olympic flag?', ['4', '5', '6', '7'], 1],
  ],
  music: [
    ['Which instrument has 88 keys?', ['Organ', 'Piano', 'Accordion', 'Harpsichord'], 1],
    ['Who is known as the "King of Pop"?', ['Elvis Presley', 'Prince', 'Michael Jackson', 'James Brown'], 2],
    ['Which band performed "Bohemian Rhapsody"?', ['The Beatles', 'Queen', 'Led Zeppelin', 'Pink Floyd'], 1],
    ['How many strings does a standard guitar have?', ['4', '5', '6', '7'], 2],
    ['Which composer wrote the "Ninth Symphony"?', ['Mozart', 'Bach', 'Beethoven', 'Chopin'], 2],
    ['What music genre originated in Jamaica?', ['Reggae', 'Jazz', 'Blues', 'Salsa'], 0],
    ['Which artist released the album "Thriller"?', ['Prince', 'Michael Jackson', 'Whitney Houston', 'Madonna'], 1],
    ['What does "forte" mean in music?', ['Soft', 'Fast', 'Loud', 'Slow'], 2],
  ],
  art: [
    ['Who painted the Mona Lisa?', ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'], 1],
    ['Which artist cut off part of his own ear?', ['Monet', 'Van Gogh', 'Picasso', 'Dali'], 1],
    ['What art movement is Salvador Dali associated with?', ['Cubism', 'Surrealism', 'Impressionism', 'Baroque'], 1],
    ['Who sculpted "David"?', ['Donatello', 'Michelangelo', 'Bernini', 'Rodin'], 1],
    ['Which museum houses the Mona Lisa?', ['The Louvre', 'The Met', 'The Prado', 'The Uffizi'], 0],
    ['Who painted "Starry Night"?', ['Monet', 'Van Gogh', 'Cezanne', 'Degas'], 1],
    ['What is the primary medium of a fresco?', ['Oil on canvas', 'Wet plaster', 'Watercolor', 'Charcoal'], 1],
    ['Which artist is known for soup can paintings?', ['Andy Warhol', 'Jackson Pollock', 'Roy Lichtenstein', 'Keith Haring'], 0],
  ],
  nature: [
    ['What is the tallest species of tree?', ['Oak', 'Coast Redwood', 'Pine', 'Baobab'], 1],
    ['How many legs does a spider have?', ['6', '8', '10', '12'], 1],
    ['What is a group of lions called?', ['A pack', 'A pride', 'A herd', 'A flock'], 1],
    ['Which gas makes up most of Earth\'s atmosphere?', ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], 2],
    ['What do you call an animal that eats both plants and meat?', ['Herbivore', 'Carnivore', 'Omnivore', 'Detritivore'], 2],
    ['Which is the largest ocean on Earth?', ['Atlantic', 'Indian', 'Pacific', 'Arctic'], 2],
    ['How many chambers does a human heart have?', ['2', '3', '4', '5'], 2],
    ['What is the fastest land animal?', ['Lion', 'Cheetah', 'Horse', 'Antelope'], 1],
  ],
  literature: [
    ['Who wrote "Romeo and Juliet"?', ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen'], 1],
    ['Who wrote "Pride and Prejudice"?', ['Jane Austen', 'Emily Bronte', 'Virginia Woolf', 'Mary Shelley'], 0],
    ['Which novel begins with "Call me Ishmael"?', ['Moby-Dick', 'Treasure Island', 'The Odyssey', 'Robinson Crusoe'], 0],
    ['Who wrote "1984"?', ['Aldous Huxley', 'George Orwell', 'Ray Bradbury', 'H.G. Wells'], 1],
    ['Who created the character Sherlock Holmes?', ['Agatha Christie', 'Arthur Conan Doyle', 'Edgar Allan Poe', 'Charles Dickens'], 1],
    ['What is the first book in "The Lord of the Rings" trilogy?', ['The Two Towers', 'The Fellowship of the Ring', 'The Return of the King', 'The Hobbit'], 1],
    ['Who wrote "Don Quixote"?', ['Miguel de Cervantes', 'Gabriel Garcia Marquez', 'Jorge Luis Borges', 'Pablo Neruda'], 0],
    ['Which author wrote "Harry Potter"?', ['J.R.R. Tolkien', 'J.K. Rowling', 'C.S. Lewis', 'Roald Dahl'], 1],
  ],
  gaming: [
    ['What plumber is Nintendo\'s mascot?', ['Luigi', 'Mario', 'Wario', 'Toad'], 1],
    ['What company created the PlayStation?', ['Microsoft', 'Nintendo', 'Sony', 'Sega'], 2],
    ['What is the best-selling video game of all time?', ['Tetris', 'Minecraft', 'GTA V', 'Wii Sports'], 1],
    ['In Pac-Man, what do you eat to turn the tables on ghosts?', ['Cherry', 'Power pellet', 'Key', 'Fruit'], 1],
    ['What does "NPC" stand for?', ['Non-Player Character', 'New Player Class', 'Network Player Client', 'Non-Playable Console'], 0],
    ['Which company makes the "Legend of Zelda" series?', ['Sega', 'Capcom', 'Nintendo', 'Square Enix'], 2],
    ['What is the name of the hedgehog mascot for Sega?', ['Sonic', 'Tails', 'Knuckles', 'Shadow'], 0],
    ['What genre is "Tetris"?', ['Platformer', 'Puzzle', 'Shooter', 'RPG'], 1],
  ],
  capitals: [
    ['What is the capital of France?', ['Lyon', 'Marseille', 'Paris', 'Nice'], 2],
    ['What is the capital of Japan?', ['Osaka', 'Kyoto', 'Tokyo', 'Nagoya'], 2],
    ['What is the capital of Canada?', ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'], 2],
    ['What is the capital of Egypt?', ['Alexandria', 'Cairo', 'Giza', 'Luxor'], 1],
    ['What is the capital of Italy?', ['Milan', 'Venice', 'Naples', 'Rome'], 3],
    ['What is the capital of Russia?', ['St. Petersburg', 'Moscow', 'Sochi', 'Kazan'], 1],
    ['What is the capital of Brazil?', ['Rio de Janeiro', 'Sao Paulo', 'Brasilia', 'Salvador'], 2],
    ['What is the capital of South Korea?', ['Busan', 'Seoul', 'Incheon', 'Daegu'], 1],
  ],
  famous_people: [
    ['Who was the first person to walk on the Moon?', ['Buzz Aldrin', 'Neil Armstrong', 'John Glenn', 'Yuri Gagarin'], 1],
    ['Who developed the theory of relativity?', ['Isaac Newton', 'Albert Einstein', 'Niels Bohr', 'Galileo Galilei'], 1],
    ['Who painted the Sistine Chapel ceiling?', ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Titian'], 0],
    ['Who was the 16th President of the United States?', ['Ulysses Grant', 'Abraham Lincoln', 'Andrew Johnson', 'James Buchanan'], 1],
    ['Who invented the telephone?', ['Thomas Edison', 'Nikola Tesla', 'Alexander Graham Bell', 'Guglielmo Marconi'], 2],
    ['Who wrote the theory of evolution by natural selection?', ['Gregor Mendel', 'Charles Darwin', 'Alfred Wallace', 'Louis Pasteur'], 1],
    ['Who was known as the "Iron Lady"?', ['Angela Merkel', 'Margaret Thatcher', 'Indira Gandhi', 'Golda Meir'], 1],
    ['Who founded Microsoft?', ['Steve Jobs', 'Bill Gates', 'Larry Page', 'Jeff Bezos'], 1],
  ],
  general: [
    ['How many days are in a leap year?', ['364', '365', '366', '367'], 2],
    ['What is the freezing point of water in Celsius?', ['-10', '0', '10', '32'], 1],
    ['How many colors are in a rainbow?', ['5', '6', '7', '8'], 2],
    ['What is the largest mammal in the world?', ['Elephant', 'Blue whale', 'Giraffe', 'Polar bear'], 1],
    ['How many sides does a hexagon have?', ['5', '6', '7', '8'], 1],
    ['What is the currency of Japan?', ['Won', 'Yuan', 'Yen', 'Ringgit'], 2],
    ['Which fruit has its seeds on the outside?', ['Strawberry', 'Kiwi', 'Fig', 'Grape'], 0],
    ['What do bees collect and use to make honey?', ['Pollen', 'Nectar', 'Sap', 'Dew'], 1],
  ],
  tech: [
    ['What does "CPU" stand for?', ['Central Process Unit', 'Central Processing Unit', 'Computer Personal Unit', 'Core Processing Utility'], 1],
    ['Who co-founded Apple with Steve Jobs?', ['Bill Gates', 'Steve Wozniak', 'Elon Musk', 'Jeff Bezos'], 1],
    ['What does "HTML" stand for?', ['Hyper Text Markup Language', 'High Text Machine Language', 'Hyperlink Text Modern Language', 'Home Tool Markup Language'], 0],
    ['Which company created the Android operating system?', ['Apple', 'Microsoft', 'Google', 'Samsung'], 2],
    ['What does "WWW" stand for?', ['World Wide Web', 'World Web Wide', 'Wide World Web', 'Web World Wide'], 0],
    ['What year was the first iPhone released?', ['2005', '2007', '2009', '2011'], 1],
    ['What does "AI" stand for?', ['Automated Intelligence', 'Artificial Intelligence', 'Applied Informatics', 'Analytic Interface'], 1],
    ['Which language is primarily used for styling web pages?', ['HTML', 'JavaScript', 'CSS', 'Python'], 2],
  ],
};

export default function trivia(container, config) {
  const bank = shuffle(BANKS[config.category] || BANKS.general);
  let idx = 0, score = 0, over = false, nextTimer = null;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Score');
  const question = el('div', { style: 'font-size:1.2em;margin:.8em 0;max-width:420px;text-align:center' });
  const options = el('div', { style: 'display:flex;flex-direction:column;gap:.5em;width:100%;max-width:380px' });
  const feedback = el('div', { class: 'overlay-sub' });

  function render() {
    if (idx >= bank.length) return end();
    const [q, opts, correct] = bank[idx];
    question.textContent = `Q${idx + 1}/${bank.length}: ${q}`;
    options.innerHTML = '';
    opts.forEach((opt, i) => {
      options.appendChild(el('button', { onclick: () => answer(i, correct) }, opt));
    });
    feedback.textContent = '';
  }

  function answer(i, correct) {
    if (over) return;
    const buttons = options.querySelectorAll('button');
    buttons.forEach((b) => (b.disabled = true));
    if (i === correct) { score++; bar.setScore(score); feedback.textContent = 'Correct!'; }
    else feedback.textContent = `Wrong — correct answer: ${bank[idx][1][correct]}`;
    nextTimer = setTimeout(() => { idx++; render(); }, 900);
  }

  function end() {
    over = true;
    overlay(wrap, 'Quiz complete!', `Score: ${score} / ${bank.length}`);
  }

  wrap.append(bar.el, question, options, feedback);
  container.appendChild(wrap);
  render();

  return { destroy() { over = true; clearTimeout(nextTimer); } };
}
