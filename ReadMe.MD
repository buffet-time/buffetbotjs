# Buffet Bot

## To use

1. Clone Repo
2. Get Discord bots token and update config.js
3. install ffmpeg on your machine
4. install <https://github.com/yt-dlp/yt-dlp?tab=readme-ov-file#installation>
5. `$ pnpm install`
6. `$ pnpm compile && pnpm execute`

## Notes for myself for deployment

`pm2 start "pnpm serve" --name bot`

in (/etc/network/interfaces)

end1 or eth0 depending on what `ip addr` reports the ethernet connection as

```bash
auto end1
iface end1 inet dhcp
        hwaddress ether 12:34:56:78:9A:BC
```
