// src/utils/platform.js

export function getPlatformInfo(link = '', platformName = '') {
  const url = (link || '').toLowerCase()
  const name = (platformName || '').toLowerCase()

  if (url.includes('leetcode.com') || name.includes('leetcode')) {
    return { name: 'LeetCode', icon: '/platform-icons/leetcode.svg' }
  }
  if (url.includes('interviewbit.com') || name.includes('interviewbit')) {
    return { name: 'InterviewBit', icon: '/platform-icons/interviewbit.svg' }
  }
  if (url.includes('takeuforward.org') || name.includes('tuf')) {
    return { name: 'TakeUForward', icon: '/platform-icons/tuf.svg' }
  }
  if (url.includes('spoj.com') || name.includes('spoj')) {
    return { name: 'SPOJ', icon: '/platform-icons/spoj.svg' }
  }
  if (url.includes('geeksforgeeks.org') || name.includes('gfg')) {
    return { name: 'GeeksforGeeks', icon: '/platform-icons/gfg.svg' }
  }

  return { name: 'Code', icon: '/platform-icons/default.svg' }
}
