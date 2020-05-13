import React from 'react';
import AppTitle from "./AppTitle";
import {ExamScores, OptionalExamForm, AppCtx} from "./ExamComponents";
import API from './API';


class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {exams: [], courses: [], mode: 'view', editedExam: null};
    }

    componentDidMount() {
        // fake loading the exams from the API server
        API.getExams().then((ex) => this.setState({exams: ex}));
        API.getCourses().then((cs) => this.setState({courses: cs}));
    }

    addOrEditExam = (exam) => {
        // Mandatory reading: https://www.robinwieruch.de/react-state-array-add-update-remove
        this.setState((state) => {
            // remove possible duplicates (same code) -- happens when you EDIT a course
            let buildState = state.exams.filter((ex) => ex.coursecode !== exam.coursecode);
            // add new exam
            buildState.push(exam);
            // sort by date
            buildState.sort((a, b) => a.date.localeCompare(b.date));
            return {exams: buildState}
        });
        this.setState({mode: 'view'});
    }

    requireEditExam = (exam) => {
        this.setState({mode: 'edit', editedExam: exam});
    }

    deleteExam = (exam) => {
        this.setState((state) => ({exams: state.exams.filter((ex) => ex.coursecode !== exam.coursecode)}));
    }

    cancelExam = () => {
        this.setState({mode: 'view', editedExam: null});

    }

    openExamForm = () => {
        this.setState({mode: 'add', editedExam: null});
    }

    render() {
        return <AppCtx.Provider value={this.state.mode}>
        <div className="App">
            <AppTitle/>
            <ExamScores exams={this.state.exams} courses={this.state.courses}
                        openExamForm={this.openExamForm} requireEditExam={this.requireEditExam}
                        deleteExam={this.deleteExam}
            />
            <OptionalExamForm courses={this.state.courses} exam={this.state.editedExam}
                              addOrEditExam={this.addOrEditExam}
                              cancelExam={this.cancelExam}
            />
        </div>
        </AppCtx.Provider>
    }

}

export default App;
