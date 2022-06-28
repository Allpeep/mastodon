import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { fetchJam } from '../../actions/jams';
import Column from '../ui/components/column';
import ScrollContainer from 'mastodon/containers/scroll_container';
import ColumnHeader from '../../components/column_header';
import { injectIntl, defineMessages } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import loading_indicator from '../../components/loading_indicator';
import { me } from '../../initial_state';

const messages = defineMessages({
  detailedStatus: { id: 'jam.title', defaultMessage: 'Jam' },
});


const makeMapStateToProps = () => {

  const mapStateToProps = (state, props) => {

    const jam = state.getIn(['jams', props.params.jamId], null);

    return {
      jam,
      domain: state.getIn(['meta', 'domain']),
      account: state.getIn(['accounts', me]),
    };
  };

  return mapStateToProps;
};

export default @injectIntl
@connect(makeMapStateToProps)
class Jam extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
    jam: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
  };

  state = {
    loadedJamId: undefined,
  };

  componentWillMount () {
    this.props.dispatch(fetchJam(this.props.params.jamId));
  }

  renderJamFrame (jam, account) {

    const jamConfig = {
      identity: {
        name: account.get('display_name') || account.get('username'),
        avatar: account.get('avatar_static'),
      },
      keys: {
        seed: jam.get('jam_seed'),
      },
    };

    const jamHash = window.btoa(JSON.stringify(jamConfig));

    return (<iframe
      title={'Jam'}
      className={'jam__iframe'}
      allow='microphone;*'
      src={`${jam.get('server_url')}/${jam.get('room_id')}?debug=yes#${jamHash}`}
    />);

  }


  render () {
    const { jam, intl, multiColumn, account } = this.props;
    const { fullscreen } = this.state;


    return (
      <Column bindToDocument={!multiColumn} label={intl.formatMessage(messages.detailedStatus)}>
        <ColumnHeader
          showBackButton
          multiColumn={multiColumn}
        />

        <ScrollContainer scrollKey='thread'>
          <div className={classNames('scrollable', { fullscreen })} ref={this.setRef}>
            { !!jam ? this.renderJamFrame(jam, account) : loading_indicator()}
          </div>
        </ScrollContainer>
      </Column>
    );
  }

}
