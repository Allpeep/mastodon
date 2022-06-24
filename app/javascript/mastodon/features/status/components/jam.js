import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'mastodon/components/avatar';
import { debounce } from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DisplayName from '../../../components/display_name';


export default class Jam extends React.PureComponent {

  static propTypes = {
    roomId: PropTypes.string,
    jam: ImmutablePropTypes.map,
    speakers: ImmutablePropTypes.list,
  };

  static defaultProps = {
  };

  state = {
  };

  // componentWillReceiveProps (nextProps) {
  //   nextProps;
  // }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);
  }

  _setDimensions () {
    const width = this.node.offsetWidth;

    this.setState({ width });
  }

  handleJamClick = (e) => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey) && this.context.router) {
      e.preventDefault();
      this.context.router.history.push(`/jams/${this.props.jam.get('id')}`);
    }

    e.stopPropagation();
  }


  handleResize = debounce(() => {
    if (this.node) {
      this._setDimensions();
    }
  }, 250, {
    trailing: true,
  });


  setRef = c => {
    this.node = c;

    if (this.node) {
      this._setDimensions();
    }
  }


  render () {
    const { jam } = this.props;

    const jamId = jam.get('id');
    const speakers = jam.get('speakers');

    return (
      <a href={`/web/jams/${jamId}`} className={'status-jam'} onClick={this.handleJamClick}>

        <ul>
          {speakers.map((speaker) => (
            <li>
              <div><Avatar account={speaker} size={24} /></div>
              <DisplayName account={speaker} />
            </li>
          ))}
        </ul>
      </a>
    );
  }

}
