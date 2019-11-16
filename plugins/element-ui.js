import Vue from 'vue'
import {
  Pagination,
  Dialog,
  Autocomplete,
  Menu,
  Input,
  Select,
  Option,
  Button,
  Table,
  Tooltip,
  Form,
  FormItem,
  Tree,
  Icon,
  Upload,
  Card,
  Container,
  Header,
  Aside,
  Main,
  Loading,
  MessageBox,
  Message,
  Notification,
  Image,
  Link,
  pageHeader,
  Backtop,
  Divider,
  Timeline,
  TimelineItem,
  MenuItem,
  TableColumn
} from 'element-ui'

Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Autocomplete)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tree)
Vue.use(Icon)
Vue.use(Upload)
Vue.use(Card)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Image)
Vue.use(Link)
Vue.use(Loading.directive)
Vue.use(pageHeader)
Vue.use(Backtop)
Vue.use(Divider)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
