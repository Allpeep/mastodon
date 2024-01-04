import React from 'react';
import { IconButton } from '../../../components/icon_button';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
  add_jam: { id: 'jam_button.add_jam', defaultMessage: 'Add a jam' },
  remove_jam: { id: 'jam_button.remove_jam', defaultMessage: 'Remove jam' },
});

const iconStyle = {
  height: null,
  lineHeight: '27px',
};


class JamButton extends React.PureComponent {

  static propTypes = {
    disabled: PropTypes.bool,
    unavailable: PropTypes.bool,
    active: PropTypes.object,
    onClick: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleClick = () => {
    this.props.onClick();
  }

  render () {
    const { intl, active, unavailable, disabled } = this.props;

    if (unavailable) {
      return null;
    }

    return (
      <div className='compose-form__jam-button'>
        <IconButton
          icon='headphones'
          title={intl.formatMessage(active ? messages.remove_jam : messages.add_jam)}
          disabled={disabled}
          onClick={this.handleClick}
          className={`compose-form__jam-button-icon ${active ? 'active' : ''}`}
          size={18}
          inverted
          style={iconStyle}
        />
      </div>
    );
  }

}
export default injectIntl(JamButton)
