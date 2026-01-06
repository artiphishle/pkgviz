unit Utils.StringUtils;

interface

uses
  System.SysUtils;

type
  TStringUtils = class
  public
    constructor Create;
    destructor Destroy; override;
    
    function Trim(const AString: string): string;
    function ToUpperCase(const AString: string): string;
    function ToLowerCase(const AString: string): string;
    function Contains(const AString, ASubstring: string): Boolean;
    function Replace(const AString, AOld, ANew: string): string;
    function HashPassword(const APassword: string): string;
    function GenerateRandomString(ALength: Integer): string;
  end;

implementation

constructor TStringUtils.Create;
begin
  inherited;
end;

destructor TStringUtils.Destroy;
begin
  inherited;
end;

function TStringUtils.Trim(const AString: string): string;
begin
  Result := System.SysUtils.Trim(AString);
end;

function TStringUtils.ToUpperCase(const AString: string): string;
begin
  Result := UpperCase(AString);
end;

function TStringUtils.ToLowerCase(const AString: string): string;
begin
  Result := LowerCase(AString);
end;

function TStringUtils.Contains(const AString, ASubstring: string): Boolean;
begin
  Result := Pos(ASubstring, AString) > 0;
end;

function TStringUtils.Replace(const AString, AOld, ANew: string): string;
begin
  Result := StringReplace(AString, AOld, ANew, [rfReplaceAll]);
end;

function TStringUtils.HashPassword(const APassword: string): string;
begin
  // Simple hash for demo purposes
  Result := IntToStr(Length(APassword) * 12345);
end;

function TStringUtils.GenerateRandomString(ALength: Integer): string;
var
  I: Integer;
const
  Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
begin
  Result := '';
  for I := 1 to ALength do
    Result := Result + Chars[Random(Length(Chars)) + 1];
end;

end.
