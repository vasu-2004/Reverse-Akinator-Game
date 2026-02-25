// ============================================================
// REVERSE AKINATOR — Character Database
// ============================================================
// This file is SERVER-SIDE ONLY.  Character names and bios are
// never exposed to the client.  Only labels, icons, and colors
// are sent via the /api/characters endpoint.
// ============================================================

const CHARACTERS = [
  // ---- TAB 1 ----
  {
    id: 0,
    name: "Sherlock Holmes",
    aliases: ["sherlock", "sherlock holmes", "holmes"],
    label: "Alpha",
    icon: "🔍",
    color: "#6c5ce7",
    bio: `Sherlock Holmes is a fictional consulting detective created by British author Sir Arthur Conan Doyle. He first appeared in the 1887 novel "A Study in Scarlet." He is a male character of British nationality, residing at 221B Baker Street, London, England, with his loyal friend and biographer Dr. John Watson. Holmes is famous for his extraordinary powers of observation, logical deduction, and forensic science skills. He plays the violin skillfully and is a competent boxer and practitioner of Bartitsu, a form of martial arts. He has a known habit of using cocaine and smoking a pipe. His elder brother is Mycroft Holmes, who holds a powerful but obscure position in the British government. His arch-nemesis is the criminal mastermind Professor James Moriarty. Holmes is not married and has no children. He is often depicted wearing a deerstalker hat and Inverness cape. He reportedly faked his own death at the Reichenbach Falls in Switzerland before returning. He appeared in four novels and 56 short stories. He is one of the most portrayed literary characters in film and television history. He is NOT a real historical person — he is fictional.`
  },

  // ---- TAB 2 ----
  {
    id: 1,
    name: "Thomas Edison",
    aliases: ["edison", "thomas edison", "thomas alva edison"],
    label: "Beta",
    icon: "💡",
    color: "#fdcb6e",
    bio: `Thomas Alva Edison was an American inventor and businessman born on February 11, 1847, in Milan, Ohio, and died on October 18, 1931, in West Orange, New Jersey. He is male. He is widely regarded as one of the most prolific inventors in history, holding over 1,093 US patents. He is best known for developing the practical incandescent electric light bulb, the phonograph (first device to record and reproduce sound), and the motion picture camera (kinetoscope). He established the first industrial research laboratory in Menlo Park, New Jersey, earning him the nickname "The Wizard of Menlo Park." He founded General Electric, one of the largest companies in the world. Edison was largely self-educated and was partially deaf from a young age. He was a key figure in the "War of Currents," championing direct current (DC) against Nikola Tesla and George Westinghouse's alternating current (AC). He married twice: first to Mary Stilwell (who died young) and then to Mina Miller. He had six children. His famous quote is "Genius is one percent inspiration, ninety-nine percent perspiration." He was a real historical person, not fictional. He was American. He lived in the 19th and early 20th centuries.`
  },

  // ---- TAB 3 ----
  {
    id: 2,
    name: "Michael Jackson",
    aliases: ["michael jackson", "mj", "king of pop", "michael joseph jackson"],
    label: "Gamma",
    icon: "🌙",
    color: "#e84393",
    bio: `Michael Joseph Jackson was an American singer, songwriter, dancer, and philanthropist born on August 29, 1958, in Gary, Indiana, and died on June 25, 2009, in Los Angeles, California. He is male. Known as the "King of Pop," he is one of the most significant cultural figures of the 20th century. He began his career as a child in the Jackson 5 (alongside his brothers) in the late 1960s and went solo in the 1970s. His album "Thriller" (1982) is the best-selling album of all time worldwide. Other landmark albums include "Bad," "Dangerous," and "HIStory." Iconic songs include "Billie Jean," "Beat It," "Thriller," "Smooth Criminal," "Black or White," and "Don't Stop 'Til You Get Enough." He popularized the moonwalk dance move. He owned the Neverland Ranch in California. He won 13 Grammy Awards and was inducted into the Rock and Roll Hall of Fame twice. He starred in the film "Moonwalker." His appearance changed notably over the years. He was a devoted humanitarian. He died of cardiac arrest caused by an overdose of the anesthetic propofol, administered by his personal physician. He was a real historical person, not fictional. He was American.`
  },

  // ---- TAB 4 ----
  {
    id: 3,
    name: "Shane Warne",
    aliases: ["shane warne", "warne", "warnie", "shane keith warne"],
    label: "Delta",
    icon: "🏏",
    color: "#00b894",
    bio: `Shane Keith Warne was an Australian international cricketer born on September 13, 1969, in Upper Ferntree Gully, Melbourne, Victoria, Australia, and died on March 4, 2022, in Koh Samui, Thailand, of a suspected heart attack. He is male. He is widely regarded as one of the greatest bowlers in cricket history and is credited with reviving the art of leg-spin bowling. He took 708 wickets in Test cricket, the second-highest total at the time of his retirement. His most famous delivery is the "Ball of the Century" to Mike Gatting during the 1993 Ashes series in England — his first ball in Ashes cricket. He played for Australia from 1992 to 2007. He also played domestic cricket for Victoria and English county cricket for Hampshire. He captained the Rajasthan Royals to victory in the inaugural Indian Premier League (IPL) in 2008. After retirement he became a respected cricket commentator and coach. He was known for his blond hair, charismatic personality, and love of life. He was a real historical person, not fictional. He was Australian. He played a sport (cricket) professionally. He was not a batsman primarily — he was a leg-spin bowler. He never captained the Australian national team.`
  },

  // ---- TAB 5 ----
  {
    id: 4,
    name: "Albert Einstein",
    aliases: ["einstein", "albert einstein"],
    label: "Epsilon",
    icon: "🧠",
    color: "#74b9ff",
    bio: `Albert Einstein was a German-born theoretical physicist born on March 14, 1879, in Ulm, Kingdom of Württemberg, German Empire, and died on April 18, 1955, in Princeton, New Jersey, USA. He is male. He is widely considered one of the greatest and most influential physicists of all time. He developed the theory of relativity, including the famous equation E=mc². He won the Nobel Prize in Physics in 1921 for his explanation of the photoelectric effect. He worked at the Swiss Patent Office in Bern early in his career. He held Swiss and American citizenship in addition to his German origin. He was Jewish. He became a professor at several universities, including the University of Zurich and the Prussian Academy of Sciences. He emigrated to the United States in 1933 to escape the Nazi regime and spent the rest of his life at the Institute for Advanced Study in Princeton, New Jersey. He played the violin as a hobby. He was known for his wild, unkempt hair and the famous tongue-out photograph. He wrote a letter to President Franklin D. Roosevelt warning about the potential of atomic weapons, which helped initiate the Manhattan Project. He was a pacifist and advocate for civil rights. He was married twice: first to Mileva Marić and then to his cousin Elsa. He had three children. He was a real historical person, not fictional.`
  },

  // ---- TAB 6 ----
  {
    id: 5,
    name: "Cleopatra",
    aliases: ["cleopatra", "cleopatra vii", "cleopatra vii philopator"],
    label: "Zeta",
    icon: "👑",
    color: "#e17055",
    bio: `Cleopatra VII Philopator was the last active ruler of the Ptolemaic Kingdom of Egypt. She was born in 69 BC in Alexandria, Egypt, and died on August 10, 30 BC, in Alexandria. She is female. Despite ruling Egypt, she was of Greek (Macedonian) descent, part of the Ptolemaic dynasty established after Alexander the Great's conquests. She was highly intelligent, reportedly spoke nine or more languages, and was the first Ptolemaic ruler to learn the Egyptian language. She is famous for her political alliances and romantic relationships with Roman leaders Julius Caesar and Mark Antony. She had a son with Caesar named Caesarion, and three children with Antony: twins Alexander Helios and Cleopatra Selene II, and Ptolemy Philadelphus. She died by suicide, traditionally said to be from the bite of an asp (Egyptian cobra), though the exact method is debated. After her death, Egypt became a province of the Roman Empire. She was known for her political acumen, charisma, and naval forces at the Battle of Actium (which she lost). She was a real historical person from the ancient world, not fictional. She was not ethnically Egyptian but of Greek-Macedonian heritage.`
  },

  // ---- TAB 7 ----
  {
    id: 6,
    name: "Napoleon Bonaparte",
    aliases: ["napoleon", "napoleon bonaparte", "bonaparte", "napoleon i"],
    label: "Eta",
    icon: "⚔️",
    color: "#d63031",
    bio: `Napoleon Bonaparte (born Napoleone di Buonaparte) was a French military leader and Emperor of the French. He was born on August 15, 1769, in Ajaccio, Corsica (which had recently become French territory), and died on May 5, 1821, on the island of Saint Helena in the South Atlantic. He is male. He rose to prominence during the French Revolution and became Emperor of France in 1804, ruling until 1814 and briefly again in 1815 during the Hundred Days. He is considered one of the greatest military commanders in history. He led France through the Napoleonic Wars, conquering much of Europe. His most famous defeat was at the Battle of Waterloo in 1815 against the Duke of Wellington and Prussian forces. He was first exiled to the island of Elba (from which he escaped) and then permanently exiled to Saint Helena, where he died. He established the Napoleonic Code, a civil legal framework that influenced many countries. The myth of his short stature is largely exaggerated — he was about average height for his era. He married twice: first to Joséphine de Beauharnais and then to Marie Louise of Austria. He had one legitimate son, Napoleon II. He was born with Italian heritage (Corsican). He was a real historical person, not fictional.`
  },

  // ---- TAB 8 ----
  {
    id: 7,
    name: "Marie Curie",
    aliases: ["marie curie", "curie", "maria sklodowska", "madame curie", "maria sklodowska-curie"],
    label: "Theta",
    icon: "☢️",
    color: "#00cec9",
    bio: `Marie Curie (born Maria Salomea Skłodowska) was a Polish and naturalized-French physicist and chemist. She was born on November 7, 1867, in Warsaw, Poland (then part of the Russian Empire), and died on July 4, 1934, near Sallanches, France. She is female. She was the first woman to win a Nobel Prize, the first person to win Nobel Prizes in two different scientific fields, and the only person to win Nobel Prizes in two different sciences. She won the Nobel Prize in Physics in 1903 (shared with her husband Pierre Curie and Henri Becquerel) for research on radiation, and the Nobel Prize in Chemistry in 1911 for her discovery of the elements polonium and radium. She coined the term "radioactivity." She was the first female professor at the University of Paris (Sorbonne). She married Pierre Curie in 1895; he died in a street accident in 1906. She had two daughters: Irène (who also won a Nobel Prize in Chemistry) and Ève. She died of aplastic anemia, almost certainly caused by prolonged exposure to radiation. During World War I, she developed mobile radiography units (called "petites Curies") to provide X-ray services to field hospitals. She was a real historical person, not fictional.`
  },

  // ---- TAB 9 ----
  {
    id: 8,
    name: "Bruce Lee",
    aliases: ["bruce lee", "lee", "lee jun-fan", "li xiaolong"],
    label: "Iota",
    icon: "🐉",
    color: "#ffeaa7",
    bio: `Bruce Lee (born Lee Jun-fan) was a Chinese-American martial artist, actor, film director, martial arts instructor, and philosopher. He was born on November 27, 1940, in San Francisco, California, USA, and died on July 20, 1973, in Hong Kong, at the young age of 32. He is male. He is widely considered the most influential martial artist of all time and a pop culture icon of the 20th century. He founded the martial arts philosophy of Jeet Kune Do ("The Way of the Intercepting Fist"). His notable films include "The Big Boss" (1971), "Fist of Fury" (1972), "Way of the Dragon" (1972, which he also directed), and "Enter the Dragon" (1973, released after his death). He was a child actor in Hong Kong, appearing in films from a young age. He studied philosophy at the University of Washington in Seattle. He was known for his extraordinary speed, the one-inch punch, and his athleticism. He married Linda Lee Cadwell and had two children: Brandon Lee (who also died young in a filming accident) and Shannon Lee. He was born in San Francisco but raised partly in Hong Kong. He was of Chinese ethnicity. His death was attributed to cerebral edema, possibly a reaction to a painkiller. He was a real historical person, not fictional.`
  },

  // ---- TAB 10 ----
  {
    id: 9,
    name: "Leonardo da Vinci",
    aliases: ["leonardo da vinci", "da vinci", "leonardo", "davinci"],
    label: "Kappa",
    icon: "🎨",
    color: "#a29bfe",
    bio: `Leonardo di ser Piero da Vinci was an Italian polymath of the High Renaissance. He was born on April 15, 1452, in Vinci, Republic of Florence (present-day Italy), and died on May 2, 1519, in Amboise, Kingdom of France. He is male. He is widely regarded as one of the most diversely talented individuals to have ever lived. He was a painter, sculptor, architect, musician, mathematician, engineer, inventor, anatomist, geologist, botanist, and writer. His most famous paintings are the "Mona Lisa" and "The Last Supper," both among the most recognizable works of art in the world. He created the iconic "Vitruvian Man" drawing. His notebooks contain designs for inventions centuries ahead of their time, including flying machines (ornithopter), an armored vehicle (tank), solar power concentrators, and various hydraulic machines. He was left-handed and wrote in mirror script. He was born out of wedlock. He never married and had no known children. He was reportedly a vegetarian. He worked for various patrons including Ludovico Sforza (Duke of Milan), Cesare Borgia, and King Francis I of France, in whose court he spent his final years. He was a real historical person, not fictional. He was Italian.`
  },

  // ---- TAB 11 ----
  {
    id: 10,
    name: "Walt Disney",
    aliases: ["walt disney", "disney", "walter disney", "walter elias disney"],
    label: "Lambda",
    icon: "✨",
    color: "#55efc4",
    bio: `Walter Elias Disney was an American animator, film producer, voice actor, and entrepreneur. He was born on December 5, 1901, in Chicago, Illinois, and died on December 15, 1966, in Burbank, California, from lung cancer. He is male. He is a pioneer of the American animation industry and introduced several developments in the production of cartoons. He co-founded (with his brother Roy O. Disney) The Walt Disney Company, which became one of the most famous entertainment corporations in the world. He created Mickey Mouse (designed with Ub Iwerks) and was the original voice of Mickey Mouse. "Snow White and the Seven Dwarfs" (1937) was his studio's first full-length animated feature film and the first in cinema history. He opened Disneyland in Anaheim, California, in 1955 — the first large-scale theme park. He was planning Walt Disney World in Florida before his death (it opened in 1971). He won 22 Academy Awards (the most by any individual), and was nominated 59 times. He served as an ambulance driver in World War I. He was a real historical person, not fictional. He was American.`
  },

  // ---- TAB 12 ----
  {
    id: 11,
    name: "Elon Musk",
    aliases: ["elon musk", "musk", "elon"],
    label: "Mu",
    icon: "🚀",
    color: "#fd79a8",
    bio: `Elon Reeve Musk is a businessman, investor, and entrepreneur born on June 28, 1971, in Pretoria, South Africa. He is male. He is still alive as of 2025. He holds South African, Canadian, and American citizenship. He is the CEO and chief engineer of SpaceX (founded 2002), CEO of Tesla, Inc. (joined as chairman in 2004, became CEO in 2008), owner and chairman of X (formerly Twitter, acquired in 2022), founder of The Boring Company, and co-founder of Neuralink and OpenAI. He co-founded X.com in 1999, which merged with Confinity to become PayPal; eBay acquired PayPal in 2002. He has been one of the richest people in the world. His stated goal is to make humanity a multi-planetary species by colonizing Mars via SpaceX. SpaceX developed the Falcon 9 rocket and Starship. Tesla produces electric vehicles including the Model S, Model 3, Model X, and Model Y. He attended Queen's University in Canada and transferred to the University of Pennsylvania. He has multiple children. He was born in South Africa and moved to Canada at age 17, then to the US. He is a real, living person, not fictional.`
  },

  // ---- TAB 13 ----
  {
    id: 12,
    name: "Hermione Granger",
    aliases: ["hermione granger", "hermione", "granger"],
    label: "Nu",
    icon: "📚",
    color: "#fab1a0",
    bio: `Hermione Jean Granger is a fictional character in the Harry Potter series written by British author J.K. Rowling. She is female. She was born on September 19, 1979, according to the books. She is one of the three main protagonists alongside Harry Potter and Ron Weasley. She is a Muggle-born witch (both her parents are non-magical dentists), which means she has no wizarding heritage. She attended Hogwarts School of Witchcraft and Wizardry and was sorted into Gryffindor house. She is known as "the brightest witch of her age" due to her exceptional intelligence, academic prowess, and encyclopedic knowledge of magic. She founded S.P.E.W. (Society for the Promotion of Elfish Welfare) to advocate for house-elf rights. She married Ron Weasley and they have two children: Rose and Hugo. She eventually became the Minister for Magic. Her Patronus is an otter. She played a crucial role in the defeat of Lord Voldemort. In the film series, she was portrayed by actress Emma Watson. She is British. She is NOT a real person — she is a fictional character from a book and film series.`
  },

  // ---- TAB 14 ----
  {
    id: 13,
    name: "Darth Vader",
    aliases: ["darth vader", "vader", "anakin skywalker", "anakin", "lord vader"],
    label: "Xi",
    icon: "🖤",
    color: "#636e72",
    bio: `Darth Vader is a fictional character in the Star Wars franchise created by George Lucas. His birth name is Anakin Skywalker. He is male. He was born on the desert planet Tatooine as a slave, raised by his mother Shmi Skywalker with no known father (he was conceived by the Force / midi-chlorians). He was discovered by Jedi Master Qui-Gon Jinn and trained by Obi-Wan Kenobi. As a child he was a talented pod racer and he built the protocol droid C-3PO. He married Padmé Amidala, a senator and former queen of Naboo. He has twin children: Luke Skywalker and Leia Organa (born after he turned to the dark side). He fell to the dark side of the Force and became a Sith Lord, apprentice to Emperor Palpatine (Darth Sidious). He wears a distinctive black armored suit with a life-support system and a helmet, and has a signature mechanical breathing sound. His most iconic line is "I am your father" (said to Luke). He uses a red lightsaber. He was originally portrayed physically by David Prowse and voiced by James Earl Jones. He was redeemed at the end of "Return of the Jedi" when he killed the Emperor to save Luke. He is NOT a real person — he is fictional, from the Star Wars universe. He appears in movies, TV shows, books, and other media.`
  },

  // ---- TAB 15 ----
  {
    id: 14,
    name: "Walter White",
    aliases: ["walter white", "heisenberg", "walt white", "mr. white"],
    label: "Omicron",
    icon: "⚗️",
    color: "#81ecec",
    bio: `Walter Hartwell White Sr. is a fictional character and the main protagonist of the American television series "Breaking Bad," created by Vince Gilligan. He is male. He is portrayed by actor Bryan Cranston. He is an American high school chemistry teacher living in Albuquerque, New Mexico. He is diagnosed with inoperable Stage III lung cancer, which motivates him to begin manufacturing and selling methamphetamine to secure his family's financial future. He adopts the alias "Heisenberg" in the drug trade. His partner in the meth business is Jesse Pinkman, a former student. His family includes his wife Skyler White, his son Walter Jr. (who goes by Flynn), and his infant daughter Holly. His brother-in-law Hank Schrader is a DEA agent who eventually discovers his secret identity. He was formerly a co-founder of Gray Matter Technologies, a successful chemistry company, but he sold his shares early for a small sum. He is brilliant at chemistry and creates an exceptionally pure blue methamphetamine. He dies at the end of the series from a self-inflicted machine gun wound. He is NOT a real person — he is a fictional character from a television series. The show aired from 2008 to 2013.`
  },

  // ---- TAB 16 ----
  {
    id: 15,
    name: "Freddie Mercury",
    aliases: ["freddie mercury", "freddy mercury", "mercury", "farrokh bulsara", "freddie"],
    label: "Pi",
    icon: "🎤",
    color: "#ff7675",
    bio: `Freddie Mercury (born Farrokh Bulsara) was a British singer, songwriter, and record producer. He was born on September 5, 1946, in Stone Town, Zanzibar (now Tanzania), and died on November 24, 1991, in Kensington, London, England. He is male. He was the lead vocalist and pianist of the rock band Queen, formed in 1970. He is widely regarded as one of the greatest singers in the history of popular music, known for his flamboyant stage persona, extraordinary four-octave vocal range, and powerful performances. He was of Parsi descent and grew up partly in India, attending boarding school near Mumbai. Iconic Queen songs he wrote or co-wrote include "Bohemian Rhapsody," "Somebody to Love," "We Are the Champions," "Don't Stop Me Now," and "Crazy Little Thing Called Love." His performance with Queen at Live Aid on July 13, 1985, at Wembley Stadium is often cited as one of the greatest live performances in rock history. He died of bronchopneumonia complicated by AIDS, which he publicly acknowledged only the day before his death. The 2018 biographical film "Bohemian Rhapsody" depicts his life, with Rami Malek playing Mercury. He was a real historical person, not fictional. He was British.`
  },

  // ---- TAB 17 ----
  {
    id: 16,
    name: "Usain Bolt",
    aliases: ["usain bolt", "bolt", "usain", "lightning bolt"],
    label: "Rho",
    icon: "⚡",
    color: "#f9ca24",
    bio: `Usain St. Leo Bolt is a Jamaican former sprinter. He was born on August 21, 1986, in Sherwood Content, Trelawny Parish, Jamaica. He is male. He is still alive as of 2025. He is widely regarded as the greatest sprinter of all time and the fastest human ever timed. He holds the world records in the 100 metres (9.58 seconds, set in Berlin 2009) and 200 metres (19.19 seconds, set in Berlin 2009). He won 8 Olympic gold medals across three consecutive Olympic Games: Beijing 2008 (100m, 200m, 4×100m relay), London 2012 (100m, 200m, 4×100m relay), and Rio 2016 (100m, 200m, 4×100m relay — though the 2008 relay gold was later stripped due to a teammate's doping violation). He is known for his "Lightning Bolt" victory pose (leaning back with one arm pointed to the sky). His nickname is "Lightning Bolt." He is unusually tall for a sprinter at 6 feet 5 inches (1.95 m). He is known for his charismatic and playful personality. He retired from athletics in 2017. He briefly attempted a career in professional football (soccer). He is Jamaican. He is a real, living person, not fictional.`
  },

  // ---- TAB 18 ----
  {
    id: 17,
    name: "Serena Williams",
    aliases: ["serena williams", "serena"],
    label: "Sigma",
    icon: "🏆",
    color: "#e056fd",
    bio: `Serena Jameka Williams is an American former professional tennis player. She was born on September 26, 1981, in Saginaw, Michigan, and grew up in Compton, California. She is female. She is still alive as of 2025. She is widely regarded as one of the greatest tennis players of all time and one of the greatest female athletes in any sport. She won 23 Grand Slam singles titles (the most in the Open Era at the time). She has won all four Grand Slam tournaments (Australian Open, French Open, Wimbledon, US Open). She also won 14 Grand Slam doubles titles with her sister Venus Williams. She was trained from a young age by her father Richard Williams (whose story was told in the 2021 film "King Richard"). Her sister Venus Williams is also a Grand Slam champion. She married Alexis Ohanian, co-founder of Reddit, in 2017. She has a daughter named Olympia (Alexis Olympia Ohanian Jr.). She is known for her powerful serve (one of the fastest in women's tennis), athletic build, and fierce competitiveness. She won four Olympic gold medals. She announced her evolution away from tennis in 2022. She is American. She is a real, living person, not fictional.`
  },

  // ---- TAB 19 ----
  {
    id: 18,
    name: "Ada Lovelace",
    aliases: ["ada lovelace", "lovelace", "ada", "ada king", "countess of lovelace", "augusta ada king"],
    label: "Tau",
    icon: "🔢",
    color: "#686de0",
    bio: `Ada Lovelace (born Augusta Ada Byron; later Augusta Ada King, Countess of Lovelace) was an English mathematician and writer. She was born on December 10, 1815, in London, England, and died on November 27, 1852, in Marylebone, London, at the age of 36. She is female. She is widely regarded as the first computer programmer for her work on Charles Babbage's proposed mechanical general-purpose computer, the Analytical Engine. She wrote what is considered the first algorithm intended to be carried out by a machine. She was the only legitimate child of the famous Romantic poet Lord Byron, though she never really knew him as he left the family shortly after her birth. Her mother was Anne Isabella "Annabella" Milbanke, who encouraged Ada's interest in mathematics and logic to steer her away from her father's poetic temperament. She was known as "The Enchantress of Numbers" (a title given to her by Babbage). She saw the potential of computers to go beyond mere calculation, envisioning that they could create music and art — a remarkably visionary insight for the 1840s. She married William King, who later became the Earl of Lovelace. She had three children. She died of uterine cancer. The programming language "Ada" was named in her honor by the U.S. Department of Defense. She was a real historical person, not fictional. She was British.`
  },

  // ---- TAB 20 ----
  {
    id: 19,
    name: "Nelson Mandela",
    aliases: ["nelson mandela", "mandela", "madiba"],
    label: "Upsilon",
    icon: "✊",
    color: "#badc58",
    bio: `Nelson Rolihlahla Mandela was a South African anti-apartheid revolutionary, political leader, and philanthropist. He was born on July 18, 1918, in Mvezo, Transkei, Union of South Africa, and died on December 5, 2013, in Johannesburg, South Africa. He is male. He served as President of South Africa from 1994 to 1999, becoming the country's first Black head of state and the first elected in a fully representative democratic election. He was a leader of the African National Congress (ANC). He was imprisoned for 27 years (1964–1990), spending 18 of those years on Robben Island, for his anti-apartheid activism and resistance to the white minority government. After his release, he led negotiations to end apartheid and establish multiracial democracy. He was awarded the Nobel Peace Prize in 1993 (shared with F.W. de Klerk). His clan name was "Madiba," a title of respect. He was a trained lawyer. He was married three times: to Evelyn Ntoko Mase, Winnie Madikizela-Mandela, and Graça Machel. He had six children. He promoted reconciliation rather than retribution after apartheid, symbolized by his support of the South African rugby team during the 1995 Rugby World Cup (depicted in the film "Invictus"). He is often called "the father of the nation" in South Africa. He was a real historical person, not fictional. He was South African.`
  }
];

module.exports = CHARACTERS;
