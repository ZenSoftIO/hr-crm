import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import CreateVacancyContainer from '../../components/containers/hr/CreateVacancyContainer';
import Header from '../general/Header';
import Paper from '@material-ui/core/Paper';

const styles = {
  paperBox: {
    margin: '1em 1.5em',
    padding: '1.5em 1em'
  }
};

class CreateVacancy extends Component {
    render() {
        const {classes} = this.props;

        return (
          <div>
            <Header title="Создать Вакансию" />
            <Paper className={classes.paperBox}> 
              <CreateVacancyContainer />
            </Paper>
          </div>
        );
    }
}

export default withStyles(styles)(CreateVacancy);
