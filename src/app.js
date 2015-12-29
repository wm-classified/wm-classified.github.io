import React from 'react';
import { take, takeLast } from 'ramda';
import { createStore } from 'redux';
import { load, postCourse } from './actions';
import courseMarketApp from './reducers';
import Footer from './components/footer';
import Title from './components/title';
import Listing from './components/listing';
import Form from './components/form';

window.COURSE_MARKET_DATA = {
  courses: [],
  posts: [],
  requests: []
};

// to ensure that this runs after the above
var store;
(function() {
  store = createStore(courseMarketApp, window.COURSE_MARKET_DATA);
})();

fetch('http://localhost:3000/data/spring')
  .then(res => res.json())
  .then(data => {
    window.COURSE_MARKET_DATA.courses = data;
    window.COURSE_MARKET_DATA.posts = take(10, data).map(d => {
      return {
        courseId: d.courseId,
        posters: ['nikkita@wm.edu']
      };
    });
    window.COURSE_MARKET_DATA.requests = takeLast(15, data).map(d => {
      return {
        courseId: d.courseId,
        posters: ['kelvin@wm.edu']
      };
    });
    window.COURSE_MARKET_HMAP = data.reduce((out, curr) => {
      out[curr.courseId] = curr;
      return out;
    }, {});
    store.dispatch(load());
  })
  .catch(e => { throw e; });


export default class App extends React.Component {

  constructor() {
    super();
    this.state = store.getState();
  }

  componentDidMount() {
    store.subscribe(() => {
      this.setState(store.getState());
    });
  }

  render() {
    return (
      <div className='container'>
        <Title />
        <div className='clearfix'>
          <div className='half left'>
            <Listing title='Posts' list={this.state.posts} />
          </div>
          <div className='half right'>
            <Listing title='Requests' list={this.state.requests} />
          </div>
        </div>
        <Form
          title='Post Class'
          onSubmit={(data) => store.dispatch(postCourse(data))}
          courses={this.state.courses} />
        <Form
          title='Request Class'
          onSumbit={(data) => console.log(data)}
          courses={this.state.courses}/>
        <Footer />
      </div>
    );
  }

}
