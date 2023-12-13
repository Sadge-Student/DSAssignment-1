import { Movie, Review } from "../shared/types";

export const movies: Movie[] = [
  {
    movieId: 1234,
    genre_ids: [28, 14, 32],
    original_language: "en",
    overview:
      "Every six years, an ancient order of jiu-jitsu fighters joins forces to battle a vicious race of alien invaders. But when a celebrated war hero goes down in defeat, the fate of the planet and mankind hangs in the balance.",
    popularity: 2633.943,
    release_date: "2020-11-20",
    title: "Title 1234",
    video: false,
    vote_average: 5.9,
    vote_count: 111,
  },
  {
    movieId: 4567,
    genre_ids: [28, 14, 32],
    original_language: "fr",
    overview:
      "Every six years, an ancient order of jiu-jitsu fighters joins forces to battle a vicious race of alien invaders. But when a celebrated war hero goes down in defeat, the fate of the planet and mankind hangs in the balance.",
    popularity: 2633.943,
    release_date: "2020-11-20",
    title: "Title 1234",
    video: false,
    vote_average: 5.9,
    vote_count: 111,
  },
  {
    movieId: 2345,
    genre_ids: [28, 14, 32],
    original_language: "en",
    overview:
      "Every six years, an ancient order of jiu-jitsu fighters joins forces to battle a vicious race of alien invaders. But when a celebrated war hero goes down in defeat, the fate of the planet and mankind hangs in the balance.",
    popularity: 2633.943,
    release_date: "2020-11-21",
    title: "Title 2345",
    video: false,
    vote_average: 5.9,
    vote_count: 111,
  },
  {
    movieId: 3456,
    genre_ids: [28, 14, 32],
    original_language: "en",
    overview:
      "Every six years, an ancient order of jiu-jitsu fighters joins forces to battle a vicious race of alien invaders. But when a celebrated war hero goes down in defeat, the fate of the planet and mankind hangs in the balance.",
    popularity: 2633.943,
    release_date: "2020-11-21",
    title: "Title 3456",
    video: false,
    vote_average: 5.9,
    vote_count: 111,
  },
];

export const reviews: Review[] = [
  {
    movieId: 1234,
    rating: 5,
    review: "I absolutely loved this movie! The plot was captivating, the acting was superb, and the special effects were mind-blowing.",
    reviewDate: "2022-12-05",
    reviewId: 5678,
    reviewerName: "John Doe",
  },
  {
    movieId: 1234,
    rating: 4,
    review: "Great movie with stunning visuals and a compelling story. A bit slow in parts, but overall a fantastic experience.",
    reviewDate: "2022-11-28",
    reviewId: 4685,
    reviewerName: "Alice Smith",
  },
  {
    movieId: 1234,
    rating: 3,
    review: "An interesting concept, but the execution was lacking. The characters weren't very engaging, and the plot had several holes.",
    reviewDate: "2023-11-30",
    reviewId: 8567,
    reviewerName: "Bob Johnson",
  },
  {
    movieId: 1234,
    rating: 5,
    review: "Absolutely phenomenal! This movie kept me on the edge of my seat from start to finish. The soundtrack was also incredible.",
    reviewDate: "2023-12-01",
    reviewId: 6428,
    reviewerName: "Carol Martinez",
  },
  {
    movieId: 1234,
    rating: 2,
    review: "Disappointing, given the hype. The special effects were good, but they couldn't make up for the weak storyline and poor character development.",
    reviewDate: "2020-12-03",
    reviewId: 6467,
    reviewerName: "David Lee",
  },
  {
    movieId: 1234,
    rating: 4,
    review: "A solid movie with great acting and a gripping plot. Some of the scenes were truly breathtaking.",
    reviewDate: "2020-12-04",
    reviewId: 1005,
    reviewerName: "Eve Kim",
  },
  {
    movieId: 5678,
    rating: 5,
    review: "A masterpiece! This movie exceeded all my expectations. It's a must-watch.",
    reviewDate: "2020-12-06",
    reviewId: 9876,
    reviewerName: "Alice Smith",
  },
  {
    movieId: 7890,
    rating: 3,
    review: "It was okay, but I expected more. The acting was good, but the story was lacking.",
    reviewDate: "2023-12-07",
    reviewId: 5432,
    reviewerName: "Bob Johnson",
  },
  {
    movieId: 4567,
    rating: 2,
    review: "Not my cup of tea. The movie didn't live up to the hype.",
    reviewDate: "2023-12-08",
    reviewId: 1234,
    reviewerName: "Emily Davis",
  },
  {
    movieId: 9876,
    rating: 2,
    review: "I found the movie to be quite boring. It didn't hold my interest.",
    reviewId: 2468,
    reviewDate: "2023-12-09",
    reviewerName: "Michael Brown",
  },
  {
    movieId: 2345,
    rating: 5,
    review: "An enthralling journey with dynamic characters and a twisty plot. The pacing was perfect, keeping me on the edge of my seat.",
    reviewDate: "2023-05-15",
    reviewId: 7812,
    reviewerName: "Alice Smith",
  },
  {
    movieId: 8910,
    rating: 3,
    review: "A decent watch with good performances, although the script could have been tighter. The cinematography was noteworthy.",
    reviewDate: "2023-04-10",
    reviewId: 5291,
    reviewerName: "Alice Smith",
  },
  {
    movieId: 1122,
    rating: 2,
    review: "Struggled to maintain interest due to predictable plotlines. The acting was solid, but it couldn't save a lackluster script.",
    reviewDate: "2023-06-22",
    reviewId: 3456,
    reviewerName: "Alice Smith",
  },
];
