import React from 'react';
import Banner from './Banner';
import Featured from './Featured';
import Trending from './Trending';
import FeaturedAuthors from './FeaturedAuthors';
import BrowseByCategory from './Categories';

const Home: React.FC = () => {
  return (
    <div>
      <Banner/>
      <BrowseByCategory/>
      <Featured/>
      <Trending/>
      <FeaturedAuthors/>
    </div>
  )
}

export default Home;
