// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Label from '../../components/Label';
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking')
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'STRATEGIC',
    items: [
      {
        title: 'Home',
        path: PATH_DASHBOARD.general.app,
        icon: ICONS.dashboard
      },
      { title: 'Active Projects', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce },
      { title: 'Active Deals', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
      { title: 'Analytics', path: PATH_DASHBOARD.general.banking, icon: ICONS.banking }
      // { title: 'booking', path: PATH_DASHBOARD.general.booking, icon: ICONS.booking }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'OPERATIONAL',
    items: [
      // OPERATIONAL : Network
      {
        title: 'Network',
        path: PATH_DASHBOARD.network.root,
        icon: ICONS.user,
        children: [
          { title: 'Create Contact', path: PATH_DASHBOARD.network.contacts },
          { title: 'Contact Cards', path: PATH_DASHBOARD.network.contactsList },
          { title: 'Create Company', path: PATH_DASHBOARD.network.companies },
          { title: 'Company Cards', path: PATH_DASHBOARD.network.companiesList },
          { title: 'Clients', path: PATH_DASHBOARD.network.clients },
          { title: 'Preferred Contacts', path: PATH_DASHBOARD.network.preferred_contacts },
          { title: 'Preferred Clients', path: PATH_DASHBOARD.network.preferred_clients }
        ]
      },

      // // OPERATIONAL : Projects
      // {
      //   title: 'Projects',
      //   path: PATH_DASHBOARD.eCommerce.root,
      //   icon: ICONS.cart,
      //   children: [
      //     { title: 'Create', path: PATH_DASHBOARD.eCommerce.createProject },
      //     { title: 'Cards', path: PATH_DASHBOARD.eCommerce.projectlist },
      //     { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
      //     { title: 'product', path: PATH_DASHBOARD.eCommerce.productById },
      //     { title: 'edit', path: PATH_DASHBOARD.eCommerce.editById },
      //     { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
      //     { title: 'invoice', path: PATH_DASHBOARD.eCommerce.invoice }
      //   ]
      // },

      // OPERATIONAL : Projects
      {
        title: 'Projects',
        path: PATH_DASHBOARD.project.root,
        icon: ICONS.cart,
        children: [
          { title: 'Create', path: PATH_DASHBOARD.project.projects },
          { title: 'Cards', path: PATH_DASHBOARD.project.projectList }
          // { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
          // { title: 'product', path: PATH_DASHBOARD.eCommerce.productById },
          // { title: 'edit', path: PATH_DASHBOARD.eCommerce.editById },
          // { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
          // { title: 'invoice', path: PATH_DASHBOARD.eCommerce.invoice }
        ]
      },

      // OPERATIONAL : Deals
      {
        title: 'Deals',
        path: PATH_DASHBOARD.blog.root,
        icon: ICONS.cart,
        children: [
          { title: 'posts', path: PATH_DASHBOARD.blog.posts },
          { title: 'post', path: PATH_DASHBOARD.blog.postById },
          { title: 'new post', path: PATH_DASHBOARD.blog.newPost }
        ]
      },

      // OPERATIONAL : Accounts
      {
        title: 'Accounts',
        path: PATH_DASHBOARD.blog.root,
        icon: ICONS.blog,
        children: [
          { title: 'posts', path: PATH_DASHBOARD.blog.posts },
          { title: 'post', path: PATH_DASHBOARD.blog.postById },
          { title: 'new post', path: PATH_DASHBOARD.blog.newPost }
        ]
      }
    ]
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'TACTICAL',
    items: [
      {
        title: 'mail',
        path: PATH_DASHBOARD.mail.root,
        icon: ICONS.mail,
        info: <Label color="error">2</Label>
      },
      { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
      { title: 'calendar', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
      {
        title: 'kanban',
        path: PATH_DASHBOARD.kanban,
        icon: ICONS.kanban
      }
    ]
  }
];

export default sidebarConfig;
