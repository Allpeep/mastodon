import { connect } from 'react-redux';
import CategoryForm from '../components/category_form';
import { changeCategory } from '../../../actions/compose';

const mapStateToProps = state => ({
  category: state.getIn(['compose', 'category']),
  categories: state.getIn(['meta', 'categories']),
});


const mapDispatchToProps = dispatch => ({
  onChangeCategory(category) {
    dispatch(changeCategory(category));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryForm);
