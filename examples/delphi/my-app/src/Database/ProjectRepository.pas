unit Database.ProjectRepository;

interface

uses
  System.SysUtils,
  Models.Project,
  Database.Connection,
  Utils.Logger;

type
  TProjectRepository = class
  private
    FConnection: TDatabaseConnection;
    FLogger: TLogger;
  public
    constructor Create;
    destructor Destroy; override;
    
    procedure Save(AProject: TProject);
    procedure Update(AProject: TProject);
    procedure Delete(AProjectId: Integer);
    function FindById(AProjectId: Integer): TProject;
    function FindByOwnerId(AOwnerId: Integer): TArray<TProject>;
    function FindAll: TArray<TProject>;
  end;

implementation

constructor TProjectRepository.Create;
begin
  inherited;
  FConnection := TDatabaseConnection.GetInstance;
  FLogger := TLogger.Create;
end;

destructor TProjectRepository.Destroy;
begin
  FLogger.Free;
  inherited;
end;

procedure TProjectRepository.Save(AProject: TProject);
begin
  FLogger.Log('Saving project: ' + AProject.GetName);
  FConnection.ExecuteQuery('INSERT INTO projects...');
end;

procedure TProjectRepository.Update(AProject: TProject);
begin
  FLogger.Log('Updating project: ' + IntToStr(AProject.GetId));
  FConnection.ExecuteQuery('UPDATE projects...');
end;

procedure TProjectRepository.Delete(AProjectId: Integer);
begin
  FLogger.Log('Deleting project: ' + IntToStr(AProjectId));
  FConnection.ExecuteQuery('DELETE FROM projects...');
end;

function TProjectRepository.FindById(AProjectId: Integer): TProject;
begin
  FLogger.Log('Finding project by ID: ' + IntToStr(AProjectId));
  Result := TProject.Create;
end;

function TProjectRepository.FindByOwnerId(AOwnerId: Integer): TArray<TProject>;
begin
  FLogger.Log('Finding projects by owner ID: ' + IntToStr(AOwnerId));
  SetLength(Result, 0);
end;

function TProjectRepository.FindAll: TArray<TProject>;
begin
  FLogger.Log('Finding all projects');
  SetLength(Result, 0);
end;

end.
