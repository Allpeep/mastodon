import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl } from 'react-intl';

@injectIntl
class JamForm extends ImmutablePureComponent {

    static propTypes = {
        jam: PropTypes.bool,
        title: PropTypes.string,
        onChangeTitle: PropTypes.func.isRequired,
    };

    handleChange = (e) => {
        this.props.onChangeTitle(e.target.value);
    };

    render() {
        const { jam } = this.props;

        if (!jam) {
            return null;
        }

        return (
            <div className='jam-form'>

                <input placeholder='Jam room title' className='jam-form-input' value={this.props.title} onChange={this.handleChange} />

            </div>
        );
    }

}

export default JamForm;