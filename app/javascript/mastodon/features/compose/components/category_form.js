import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl } from 'react-intl';

@injectIntl
class CategoryForm extends ImmutablePureComponent {

  constructor(props) {
    super(props);
    this.state = {
      category: undefined,
    };
  }

  static propTypes = {
    categoryId: PropTypes.string,
    onChangeCategory: PropTypes.func.isRequired,
  };

  handleChange = (e) => {
    this.props.onChangeCategory(e.target.value);
  };


  render() {
    const { categoryId, categories } = this.props;

    return (
      <div className='category-form'>
        <select
          className='category-form-input'
          value={categoryId}
          onBlur={this.handleChange}
        >
          {categories.map((category) => <option value={category}>{category}</option>)}
        </select>
      </div>
    );
  }

}

export default CategoryForm;
