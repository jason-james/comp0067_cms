import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import { Nav } from './common/nav'
import { Home } from './views/home'
import { AllArticles } from "./views/allArticles";
import { NewArticle } from "./views/newArticle";
import { EditArticle } from "./views/editArticle";
import { createBrowserHistory } from "history";

export const customHistory = createBrowserHistory();

function App() {
  return (
      <Router history={customHistory}>
        <div>
          <Nav/>
            <Switch>
              <Route exact path="/" component={withRouter(Home)}/>
              <Route exact path="/articles" component={withRouter(AllArticles)}/>
              <Route exact path="/new_article" component={withRouter(NewArticle)}/>
              <Route exact path="/edit_article" component={withRouter(EditArticle)}/>
                {/*<Route component={withRouter(NotFound)}/>*/}
            </Switch>
        </div>
      </Router>
  );
}

export default App;
