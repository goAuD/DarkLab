# Network Issue Log 2025|06|23

[![Join the TrustMindLab Discussions](https://img.shields.io/badge/Join-TrustMindLab-blueviolet)](https://github.com/goAuD/MyHomeLab/discussions/1)
<div class="badge-base LI-profile-badge" data-locale="hu_HU" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="viktor-halupka-weiz" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://at.linkedin.com/in/viktor-halupka-weiz?trk=profile-badge">Viktor Halupka</a></div>

## 1. "Ghost IP" - 192.168.0.23 (incomplete)

**Issue:**  
pfSense kept showing `192.168.0.23` in the ARP table with `(incomplete)` status - no MAC address, no obvious source. Looked like a device was trying to connect, but nothing existed on the network with that IP.

**What I tried:**  

- Checked with `arp -a`, `tcpdump -i re0 host 192.168.0.23` - no response  

- Despite that, ICMP traffic showed up in pfSense logs: something was pinging that IP from the LAN

**Solution:**  
Turned out it was **PRTG** still trying to ping a **nonexistent legacy device**. The sensor was still active even though the device was long gone.

Deleted/disabled the sensor in PRTG → no more ghost IP in ARP.

---

## 2. Sticky IP-MAC Binding - 192.168.0.39 (permanent)

**Issue:**  
192.168.0.39 kept showing up in pfSense's ARP table on the WAN interface (`re0`) as `permanent`, even after I removed the static DHCP mapping.

**Initial suspicion:**  
Thought it was my **Netgear GS308E switch**, which had the MAC `40:b0:34:6b:98:32`. I even hard-reset the switch, but the binding still showed up.

**Root cause:**  
The **same IP-MAC binding was active on both routers**:  

- The old **ISP router** had it set as a static DHCP lease  

- The new **pfSense** setup inherited or clashed with it

**Fix:**  
Removed the static mapping from *both* routers. After that, pfSense was finally able to clear the ARP cache and release the IP properly.

---

## Additional Notes

- That ghost IP (192.168.0.23) was purely from **PRTG’s leftover sensor**, not an actual device.

- The **Netgear GS308E** switch did not respond to the config utility properly - possibly due to network mismatch or software limitations.

- PRTG also showed the **HP printer as down**:  
  `"hp0418e8"` could not be resolved → hostname/DNS issue. May need to switch the printer to a static IP with proper DNS registration.

---

## Summary

- [x] Ghost IP (192.168.0.23) → caused by PRTG, resolved by disabling the sensor  

- [x] Sticky IP-MAC (192.168.0.39) → caused by duplicate DHCP static mappings on both routers, fixed by removing both  

- [x] Cleaned ARP and DHCP mappings in pfSense  

- [ ] Still need to verify DNS config for the printer
