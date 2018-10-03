import * as spies from 'chai-spies';
import * as chai from 'chai';

import { describe, beforeEach, it } from 'mocha';

import {
  QueryPromise,
  RulesConfig,
  RemovePromise,
  trimTabs
} from './tabs_helpers'
import { expect } from 'chai';

beforeEach(() => {
  chai.use(spies)
})

describe('trimTabs()', function () {
  it('doesnt do anything if config disabled', () => {
    const tab: chrome.tabs.Tab = {
      index: 1,
      url: "http://url",
      pinned: false,
      highlighted: false,
      windowId: 1,
      active: true,
      id: 123,
      incognito: false,
      selected: false,
      discarded: false,
      autoDiscardable: false
    }

    const conf: RulesConfig = {
      duplicates: {
        isActivated: true,
      },
      group: {
        isActivated: true,
        type: "FULL_DOMAIN"
      },
      host: {
        isActivated: false,
        maxTabsAllowed: 5,
      }
    }

    const queryPromise: QueryPromise = (i: chrome.tabs.QueryInfo) => {
      return Promise.resolve([])
    }

    const removePromise: RemovePromise = (id: number) => {
      return Promise.resolve()
    }

    const removeSpy = chai.spy(removePromise)

    return trimTabs(tab, conf, queryPromise, removeSpy).then(() => {
      expect(removeSpy).not.to.have.been.called()
    })

  })

  it('doesnt do anything with only one tab', () => {
    const tab: chrome.tabs.Tab = {
      index: 1,
      url: "http://url",
      pinned: false,
      highlighted: false,
      windowId: 1,
      active: true,
      id: 123,
      incognito: false,
      selected: false,
      discarded: false,
      autoDiscardable: false
    }

    const conf: RulesConfig = {
      duplicates: {
        isActivated: true,
      },
      group: {
        isActivated: true,
        type: "FULL_DOMAIN"
      },
      host: {
        isActivated: true,
        maxTabsAllowed: 5,
      }
    }

    const queryPromise: QueryPromise = (i: chrome.tabs.QueryInfo) => {
      return Promise.resolve([])
    }

    const removePromise: RemovePromise = (id: number) => {
      return Promise.resolve()
    }

    const removeSpy = chai.spy(removePromise)

    return trimTabs(tab, conf, queryPromise, removeSpy).then(() => {
      expect(removeSpy).not.to.have.been.called()
    })

  })

  it('doesnt do anything with less than allowed tabs', () => {
    const tab: chrome.tabs.Tab = {
      index: 1,
      url: "http://url",
      pinned: false,
      highlighted: false,
      windowId: 1,
      active: true,
      id: 123,
      incognito: false,
      selected: false,
      discarded: false,
      autoDiscardable: false
    }

    const conf: RulesConfig = {
      duplicates: {
        isActivated: true,
      },
      group: {
        isActivated: true,
        type: "FULL_DOMAIN"
      },
      host: {
        isActivated: true,
        maxTabsAllowed: 5,
      }
    }

    const queryPromise: QueryPromise = (i: chrome.tabs.QueryInfo) => {
      return Promise.resolve([tab])
    }

    const removePromise: RemovePromise = (id: number) => {
      return Promise.resolve()
    }


    const removeSpy = chai.spy(removePromise)

    return trimTabs(tab, conf, queryPromise, removeSpy).then(() => {
      expect(removeSpy).not.to.have.been.called()
    })
  })

  it('trims the oldest tabs', () => {
    const tab: chrome.tabs.Tab = {
      index: 1,
      url: "http://url",
      pinned: false,
      highlighted: false,
      windowId: 1,
      active: true,
      id: 1,
      incognito: false,
      selected: false,
      discarded: false,
      autoDiscardable: false
    }

    const conf: RulesConfig = {
      duplicates: {
        isActivated: true,
      },
      group: {
        isActivated: true,
        type: "FULL_DOMAIN"
      },
      host: {
        isActivated: true,
        maxTabsAllowed: 1,
      }
    }

    const t2 = { ...tab, id: 2 }

    const queryPromise: QueryPromise = (i: chrome.tabs.QueryInfo) => {
      return Promise.resolve([t2])
    }

    const removePromise: RemovePromise = (id: number) => {
      return Promise.resolve()
    }

    const removeSpy = chai.spy(removePromise)

    return trimTabs(tab, conf, queryPromise, removeSpy).then(() => {
      expect(removeSpy).to.have.been.called.always.with.exactly(2)
    })
  })

  it('trims the oldest tab', () => {
    const tab: chrome.tabs.Tab = {
      index: 1,
      url: "http://url",
      pinned: false,
      highlighted: false,
      windowId: 1,
      active: true,
      id: 1,
      incognito: false,
      selected: false,
      discarded: false,
      autoDiscardable: false
    }

    const conf: RulesConfig = {
      duplicates: {
        isActivated: true,
      },
      group: {
        isActivated: true,
        type: "FULL_DOMAIN"
      },
      host: {
        isActivated: true,
        maxTabsAllowed: 2,
      }
    }

    const t2 = { ...tab, id: 2 }
    const t3 = { ...tab, id: 3 }
    const t4 = { ...tab, id: 4 }

    const queryPromise: QueryPromise = (i: chrome.tabs.QueryInfo) => {
      return Promise.resolve([t2, t3, t4])
    }

    const removePromise: RemovePromise = (id: number) => {
      return Promise.resolve()
    }

    const removeSpy = chai.spy(removePromise)

    return trimTabs(tab, conf, queryPromise, removeSpy).then(() => {
      expect(removeSpy).to.have.been.called.with(2)
      expect(removeSpy).to.have.been.called.with(3)
    })
  })
})