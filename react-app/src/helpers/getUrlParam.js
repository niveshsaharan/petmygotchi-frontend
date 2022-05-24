export default function getUrlParam(key, url) {
  return new URL(url || window.location.href).searchParams.get(key);
}
