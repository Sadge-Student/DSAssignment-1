import {Movie, Review} from '../shared/types'

export const movies : Movie[] = [
  {
    movieId: 1234,
    genre_ids: [28, 14, 32],
    original_language: 'en',
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
    original_language: 'fr',
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
    original_language: 'en',
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
    original_language: 'en',
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

export const reviews : Review[] = [
  {
    movieId: 1234,
    rating: 5,
    review: "I absolutely loved this movie! The plot was captivating, the acting was superb, and the special effects were mind-blowing.",
    reviewDate: "2023-12-05",
    reviewId: 5678,
    reviewer: "John Doe"
  },
  {
    movieId: 5678,
    rating: 5,
    review: "A masterpiece! This movie exceeded all my expectations. It's a must-watch.",
    reviewDate: "2023-12-06",
    reviewId: 9876,
    reviewer: "Alice Smith"
  },
  {
    movieId: 7890,
    rating: 3,
    review: "It was okay, but I expected more. The acting was good, but the story was lacking.",
    reviewDate: "2023-12-07",
    reviewId: 5432,
    reviewer: "Bob Johnson"
  },
  {
    movieId: 4567,
    rating: 2,
    review: "Not my cup of tea. The movie didn't live up to the hype.",
    reviewDate: "2023-12-08",
    reviewId: 1234,
    reviewer: "Emily Davis",
  },
  {
    movieId: 9876,
    rating: 2,
    review: "I found the movie to be quite boring. It didn't hold my interest.",
    reviewId: 2468,
    reviewDate: "2023-12-09",
    reviewer: "Michael Brown"
  }
]