// Add only certificates already trusted by Windows; never disable TLS checks.
const {execFileSync}=require('node:child_process');
const tls=require('node:tls');
const roots=execFileSync('powershell.exe',['-NoProfile','-Command',"Get-ChildItem Cert:\\LocalMachine\\Root,Cert:\\CurrentUser\\Root | ForEach-Object { [Convert]::ToBase64String($_.RawData) }"],{encoding:'utf8',windowsHide:true}).trim().split(/\r?\n/).filter(Boolean).map(b=>'-----BEGIN CERTIFICATE-----\n'+b.match(/.{1,64}/g).join('\n')+'\n-----END CERTIFICATE-----');
const original=tls.createSecureContext;
tls.createSecureContext=function(options={}){return original.call(this,{...options,ca:options.ca||[...tls.rootCertificates,...roots]});};
