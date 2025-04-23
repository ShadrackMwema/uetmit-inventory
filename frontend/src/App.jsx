import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import InstrumentList from './components/InstrumentList';
import InstrumentForm from './components/InstrumentForm';
import ChecklistHistory from './components/ChecklistHistory';
import NewChecklist from './components/NewChecklist';
import PreviousChecklists from './components/PreviousChecklists';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import './styles.css';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <Switch>
                    <Route path="/" exact component={Dashboard} />
                    <Route path="/instruments" component={InstrumentList} />
                    <Route path="/add" component={InstrumentForm} />
                    <Route path="/edit/:id" component={InstrumentForm} />
                    <Route path="/history" component={ChecklistHistory} />
                    <Route path="/new-checklist" component={NewChecklist} />
                    <Route path="/checklists" component={PreviousChecklists} />
                    <Route path="/settings" component={Settings} />
                </Switch>
            </div>
        </Router>
    );
};

export default App;