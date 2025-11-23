**The project is no longer maintained.** The author of the project ([@SukkaW](https://github.com/SukkaW)) has shifted focus to use "infrastructure as code" approach, and programmatically managing Vercel DNS via StackOverflow's [DNSControl](https://github.com/StackExchange/dnscontrol) instead. See also https://github.com/StackExchange/dnscontrol/pull/3542.

----

# Vercel DNS Console (Unofficial)

This is an **unofficial** implementation of Vercel DNS Console.

## Demo

<https://vercel-dns.skk.moe>

## Techstack

- [React](https://reactjs.org) - A JavaScript Library for Building User Interfaces
- [Next.js](https://nextjs.org) - The React Framework for Production
- [Geist UI](https://geist-ui.dev/) - An Open Source Design System for Building Modern Websites and Applications
- [foxact](https://foxact.skk.moe) - React Hooks/Utils done right. For Browser, SSR, and React Server Components.
- [SWR](https://swr.vercel.app) - React Hooks for Data Fetching
- [React Table V7](https://react-table-v7.tanstack.com/) - Lightweight and Extensible Data Tables for React

## Features

- [x] List existing domains
- [x] Create a new DNS record
- [x] Delete an existing DNS record
- [x] Delete multiple DNS records
- [x] Search and filter DNS records
- [x] Edit an existing record

## Build

```bash
git clone https://github.com/sukkaw/vercel-dns-console.git
cd vercel-dns-console
npm i
npm run dev # npm run build / npm run start / npm run analyze
```

## License

[MIT](./LICENSE)

----

**Vercel DNS Console (Unofficial)** © [Sukka](https://github.com/SukkaW), Released under the [MIT](./LICENSE) License.
Authored and maintained by Sukka with help from contributors ([list](https://github.com/SukkaW/vercel-dns-console/graphs/contributors)).

> [Personal Website](https://skk.moe) · [Blog](https://blog.skk.moe) · GitHub [@SukkaW](https://github.com/SukkaW) · Telegram Channel [@SukkaChannel](https://t.me/SukkaChannel) · Twitter [@isukkaw](https://twitter.com/isukkaw) · Keybase [@sukka](https://key

<p align="center">
  <a href="https://github.com/sponsors/SukkaW/">
    <img src="https://sponsor.cdn.skk.moe/sponsors.svg"/>
  </a>
</p>
