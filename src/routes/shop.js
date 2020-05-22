import {
    Contact,
    ShopProducts,
    ShopFeedback,
    LeaveFeedback,
    ContactReply
} from 'screens'

const shopRoutes = [
  {
    path: `/:username/contact`,
    name: 'Contact',
    component: Contact
  },

  {
    path: `/:username/query/:id`,
    name: 'Leave Query',
    component: ContactReply
  },

  {
    path: `/:username/feedback/:id`,
    name: 'Leave Feedback',
    component: LeaveFeedback
  },

  {
    path: `/:username/feedback`,
    name: 'Feedback',
    component: ShopFeedback
  },

  {
    path: `/:username`,
    name: 'Products',
    component: ShopProducts
  }
]
  
export default shopRoutes